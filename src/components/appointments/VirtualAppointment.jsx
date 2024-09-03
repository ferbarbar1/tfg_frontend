import React, { useEffect, useRef, useState, useContext } from 'react';
import Peer from 'peerjs';
import Webcam from 'react-webcam';
import { Box, Typography, Paper, Grid, Button, IconButton } from '@mui/material';
import { getAppointment, updateAppointment } from '../../api/appointments.api';
import { AuthContext } from '../../contexts/AuthContext';
import CallEndIcon from '@mui/icons-material/CallEnd';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export function VirtualAppointment({ appointmentId, role, informSaved }) {
    const { t } = useTranslation();
    const [peerId, setPeerId] = useState('');
    const [remotePeerId, setRemotePeerId] = useState('');
    const [isRemotePeerAvailable, setIsRemotePeerAvailable] = useState(false);
    const [clientName, setClientName] = useState('');
    const [workerName, setWorkerName] = useState('');
    const [appointment, setAppointment] = useState(null);
    const localWebcamRef = useRef(null);
    const remoteWebcamRef = useRef(null);
    const peerInstance = useRef(null);
    const localStreamRef = useRef(null);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointment = async () => {
            try {
                const response = await getAppointment(appointmentId);
                const remoteId = role === 'worker' ? response.data.client_peer_id : response.data.worker_peer_id;
                setClientName(response.data.client.user.username);
                setWorkerName(response.data.worker.user.username);
                setRemotePeerId(remoteId);
                setIsRemotePeerAvailable(!!remoteId);
                setAppointment(response.data);
            } catch (error) {
                console.error('Error fetching appointment:', error);
            }
        };
        fetchAppointment();
    }, [appointmentId, role, informSaved]);

    useEffect(() => {
        const initializePeer = () => {
            const peer = new Peer();

            peer.on('open', async (id) => {
                setPeerId(id);
                const updatedPeerId = role === 'worker' ? { worker_peer_id: id } : { client_peer_id: id };
                try {
                    await updateAppointment(appointmentId, updatedPeerId);
                } catch (error) {
                    console.error('Error updating appointment with peer ID:', error);
                }

                // Intentar conectar si el peer remoto ya está disponible
                if (isRemotePeerAvailable) {
                    initiateCall(remotePeerId);
                }
            });

            peer.on('call', (call) => {
                handleUserMedia().then((mediaStream) => {
                    call.answer(mediaStream);
                    handleIncomingStream(call);
                });
            });

            peerInstance.current = peer;

            return () => {
                peer.destroy();
            };
        };

        initializePeer();
    }, [appointmentId, role, isRemotePeerAvailable]);

    useEffect(() => {
        const checkRemotePeer = async () => {
            if (!isRemotePeerAvailable) {
                try {
                    const response = await getAppointment(appointmentId);
                    const remoteId = role === 'worker' ? response.data.client_peer_id : response.data.worker_peer_id;
                    if (remoteId) {
                        setRemotePeerId(remoteId);
                        setIsRemotePeerAvailable(true);
                        // Iniciar la llamada si el peer remoto ya está disponible
                        initiateCall(remoteId);
                    }
                } catch (error) {
                    console.error('Error fetching remote peer ID:', error);
                }
            }
        };

        const interval = setInterval(checkRemotePeer, 2000);
        return () => clearInterval(interval);
    }, [appointmentId, role, isRemotePeerAvailable]);

    const handleUserMedia = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            localStreamRef.current = mediaStream;
            if (localWebcamRef.current) {
                localWebcamRef.current.video.srcObject = mediaStream;
                localWebcamRef.current.video.play();
            }
            return mediaStream;
        } catch (error) {
            console.error('Error accessing media devices.', error);
            throw error;
        }
    };

    const initiateCall = async (remoteId) => {
        try {
            const mediaStream = await handleUserMedia();
            const call = peerInstance.current.call(remoteId, mediaStream);
            handleIncomingStream(call);
        } catch (error) {
            console.error('Error initiating call:', error);
        }
    };

    const handleIncomingStream = (call) => {
        call.on('stream', (remoteStream) => {
            if (remoteWebcamRef.current) {
                remoteWebcamRef.current.video.srcObject = remoteStream;
                remoteWebcamRef.current.video.play();
            }
        });
        call.on('close', endCall);
    };

    const toggleFullscreen = (webcamRef) => {
        if (webcamRef.current) {
            if (webcamRef.current.video.requestFullscreen) {
                webcamRef.current.video.requestFullscreen();
            } else if (webcamRef.current.video.mozRequestFullScreen) { /* Firefox */
                webcamRef.current.video.mozRequestFullScreen();
            } else if (webcamRef.current.video.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
                webcamRef.current.video.webkitRequestFullscreen();
            } else if (webcamRef.current.video.msRequestFullscreen) { /* IE/Edge */
                webcamRef.current.video.msRequestFullscreen();
            }
        }
    };

    const endCall = async () => {
        if (localStreamRef.current) {
            localStreamRef.current.getTracks().forEach(track => track.stop());
        }
        if (peerInstance.current) {
            peerInstance.current.destroy();
        }

        if (role === 'worker') {
            try {
                await updateAppointment(appointmentId, { status: 'COMPLETED' });
            } catch (error) {
                console.error('Error updating appointment status:', error);
            }
            navigate(`/my-appointments/${appointmentId}/details`);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            {role === 'client' && !isRemotePeerAvailable && (
                <Typography variant="body1" align="center" sx={{ mb: 1 }}>
                    {t('waiting_for_other_user')}
                </Typography>
            )}
            <Grid container spacing={2} direction={role === 'worker' ? 'column' : 'row'}>
                <Grid item xs={role === 'worker' ? 12 : 6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            width: '100%',
                            margin: '0 auto',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%' }}>
                            <Typography variant="h6" align="center">
                                {user.user.username}
                            </Typography>
                            <Typography variant="body2" align="center" sx={{ color: 'gray' }}>
                                {peerId}
                            </Typography>
                            <Webcam
                                audio={false}
                                ref={localWebcamRef}
                                videoConstraints={{ facingMode: 'user' }}
                                style={{
                                    width: '100%',
                                    height: '200px',
                                    borderRadius: '8px',
                                    marginTop: '8px',
                                }}
                            />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
                            <IconButton onClick={() => toggleFullscreen(localWebcamRef)} color="primary">
                                <FullscreenIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={role === 'worker' ? 12 : 6}>
                    <Paper
                        elevation={3}
                        sx={{
                            p: 2,
                            width: '100%',
                            margin: '0 auto',
                            height: 'auto',
                            display: 'flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                        }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%' }}>
                            <Typography variant="h6" align="center">
                                {role === 'client' ? workerName : clientName}
                            </Typography>
                            <Typography variant="body2" align="center" sx={{ color: 'gray' }}>
                                {remotePeerId}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                                {isRemotePeerAvailable ? (
                                    <Webcam
                                        audio={true}
                                        ref={remoteWebcamRef}
                                        videoConstraints={{ facingMode: 'user' }}
                                        style={{
                                            width: '100%',
                                            height: '200px',
                                            borderRadius: '8px',
                                            marginTop: '8px',
                                        }}
                                    />
                                ) : (
                                    <Box
                                        sx={{
                                            width: '100%',
                                            height: '100%',
                                            display: 'flex',
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            border: '2px dashed gray',
                                            borderRadius: '8px',
                                        }}
                                    >
                                        <Typography variant="body1" align="center">
                                            {t('remote_user_not_joined')}
                                        </Typography>
                                    </Box>
                                )}
                            </Box>
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', ml: 2 }}>
                            <IconButton onClick={() => toggleFullscreen(remoteWebcamRef)} color="primary">
                                <FullscreenIcon />
                            </IconButton>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            {role === 'worker' && appointment && appointment.inform &&
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                    <Button onClick={endCall} variant="contained" color="error" startIcon={<CallEndIcon />}>
                        {t('end_call')}
                    </Button>
                </Box>
            }
        </Box>
    );
}