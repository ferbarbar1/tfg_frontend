import React, { useState, useEffect, useContext } from 'react';
import { getAppointmentsByWorker, getAppointmentsByClient } from '../../api/appointments.api';
import { createConversation, getConversationsByParticipants } from '../../api/conversations.api';
import { AuthContext } from '../../contexts/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useMediaQuery, Tabs, Tab, TextField, MenuItem, InputLabel, FormControl, Select, IconButton, Tooltip, Modal } from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import ChatIcon from '@mui/icons-material/Chat';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import VideoCallIcon from '@mui/icons-material/VideoCall';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { RateAppointmentForm } from '../../components/ratings/RateAppointmentForm';

const StyledDataGrid = styled(DataGrid)({
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
});

const TabPanel = (props) => {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <div>{children}</div>
                </Box>
            )}
        </div>
    );
};

export const MyAppointmentsPage = () => {
    const { t } = useTranslation();
    const [appointments, setAppointments] = useState([]);
    const [statusFilter, setStatusFilter] = useState('');
    const [dateFilter, setDateFilter] = useState('');
    const [modalityFilter, setModalityFilter] = useState('');
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);

    const [showModal, setShowModal] = useState(false);
    const [appointmentId, setAppointmentId] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                let response;
                if (user.user.role === 'worker') {
                    response = await getAppointmentsByWorker(user.id);
                } else if (user.user.role === 'client') {
                    response = await getAppointmentsByClient(user.id);
                }

                if (response && response.data) {
                    setAppointments(response.data.map((appointment, index) => ({
                        ...appointment,
                        id: index,
                        appointmentId: appointment.id,
                        serviceId: appointment.service.id,
                        service: appointment.service.name,
                        status: appointment.status,
                        modality: appointment.modality,
                        date: new Date(appointment.schedule.date).toLocaleDateString(),
                        time: `${appointment.schedule.start_time.split(':').slice(0, 2).join(':')} - ${appointment.schedule.end_time.split(':').slice(0, 2).join(':')}`
                    })));
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [user.id, user.user.role]);

    const today = new Date().toLocaleDateString();
    const todayAppointments = appointments.filter(appointment => appointment.date === today);

    const activeTab = queryParams.get('tab') || 'today';

    const handleChange = (event, newValue) => {
        navigate(`?tab=${newValue}`);
    };

    const handleStatusChange = (event) => {
        setStatusFilter(event.target.value);
    };

    const handleDateChange = (event) => {
        setDateFilter(event.target.value);
    };

    const handleModalityChange = (event) => {
        setModalityFilter(event.target.value);
    };

    const handleClearFilters = () => {
        setStatusFilter('');
        setDateFilter('');
        setModalityFilter('');
    };

    const handleChat = async (event, appointment) => {
        event.stopPropagation();
        event.preventDefault();
        try {
            let participantIds;
            if (user.user.role === 'client') {
                participantIds = [user.user.id, appointment.worker.user.id];
            } else if (user.user.role === 'worker') {
                participantIds = [user.user.id, appointment.client.user.id];
            }

            const response = await getConversationsByParticipants(participantIds);
            let conversationId;

            if (response.data.length > 0) {
                conversationId = response.data[0].id;
            } else {
                const newConversation = await createConversation({ participants: participantIds });
                conversationId = newConversation.data.id;
            }

            navigate(`/chat/${conversationId}`);
        } catch (error) {
            console.error(error);
        }
    };

    const handleStartVideoCall = (event, appointmentId) => {
        event.stopPropagation();
        event.preventDefault();
        navigate(`/appointments/${appointmentId}/video-call`);
    };

    const handleRateAppointment = (event, appointmentId) => {
        event.stopPropagation();
        event.preventDefault();
        setAppointmentId(appointmentId);
        setIsUpdate(true);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const columns = [
        {
            field: 'service',
            headerName: t('service_label'),
            flex: 1,
            minWidth: 150,
            sortable: true,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center', wordWrap: 'break-word' }}>{params.value}</div>
        },
        {
            field: 'date',
            headerName: t('date'),
            flex: 1,
            minWidth: 120,
            sortable: true,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center' }}>{params.value}</div>
        },
        {
            field: 'time',
            headerName: t('time_label'),
            flex: 1,
            minWidth: 150,
            sortable: true,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center' }}>{params.value}</div>
        },
        !isMobile && {
            field: 'status',
            headerName: t('status_label'),
            flex: 1,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center' }}>{params.value}</div>
        },
        !isMobile && {
            field: 'modality',
            headerName: t('modality_label'),
            flex: 1,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center' }}>{params.value}</div>
        },
        {
            field: 'actions',
            headerName: t('actions'),
            flex: 1,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <Box>
                    {params.row.status === 'CONFIRMED' && (
                        <>
                            <Tooltip title={t('chat_button')}>
                                <IconButton aria-label={t('chat_button')} onClick={(event) => handleChat(event, params.row)}>
                                    <ChatIcon color='primary' />
                                </IconButton>
                            </Tooltip>
                            {params.row.modality === 'VIRTUAL' && (
                                <Tooltip title={t('join_video_call')}>
                                    <IconButton aria-label={t('join_video_call')} onClick={(event) => handleStartVideoCall(event, params.row.appointmentId)}>
                                        <VideoCallIcon color='secondary' />
                                    </IconButton>
                                </Tooltip>
                            )}
                        </>
                    )}
                    {params.row.status === 'COMPLETED' && user.user.role === 'client' && (
                        <Tooltip title={t('rate_button')}>
                            <IconButton aria-label={t('rate_button')} onClick={(event) => handleRateAppointment(event, params.row.appointmentId)}>
                                <ThumbUpOffAltIcon color='primary' />
                            </IconButton>
                        </Tooltip>
                    )}
                </Box>
            )
        }
    ].filter(Boolean);

    const filteredAppointments = appointments.filter(appointment => {
        const formattedDate = new Date(dateFilter).toLocaleDateString();
        return (
            (!statusFilter || appointment.status === statusFilter) &&
            (!dateFilter || appointment.date === formattedDate) &&
            (!modalityFilter || appointment.modality === modalityFilter)
        );
    });

    const upcomingAppointments = filteredAppointments.filter(appointment => new Date(appointment.schedule.date) >= new Date());
    const pastAppointments = filteredAppointments.filter(appointment => new Date(appointment.schedule.date) < new Date());

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={activeTab} onChange={handleChange}>
                <Tab value="today" label={t('today')} />
                <Tab value="upcoming" label={t('upcoming')} />
                <Tab value="history" label={t('history')} />
            </Tabs>
            {activeTab === 'upcoming' && (
                <TabPanel value={activeTab} index="upcoming">
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="status-label">{t('status_label')}</InputLabel>
                            <Select
                                labelId="status-label"
                                value={statusFilter}
                                onChange={handleStatusChange}
                                label={t('status_label')}
                            >
                                <MenuItem value="">{t('all')}</MenuItem>
                                <MenuItem value="CONFIRMED">{t('confirmed')}</MenuItem>
                                <MenuItem value="COMPLETED">{t('completed')}</MenuItem>
                                <MenuItem value="CANCELLED">{t('cancelled')}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <TextField
                                type="date"
                                value={dateFilter}
                                onChange={handleDateChange}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="modality-label">{t('modality_label')}</InputLabel>
                            <Select
                                labelId="modality-label"
                                value={modalityFilter}
                                onChange={handleModalityChange}
                                label={t('modality_label')}
                            >
                                <MenuItem value="">{t('all')}</MenuItem>
                                <MenuItem value="VIRTUAL">{t('virtual')}</MenuItem>
                                <MenuItem value="IN_PERSON">{t('in_person')}</MenuItem>
                            </Select>
                        </FormControl>
                        {(statusFilter || dateFilter || modalityFilter) && (
                            <Tooltip title={t('clear_button')}>
                                <IconButton
                                    onClick={handleClearFilters}
                                    sx={{ mt: 2 }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    <Box
                        sx={{
                            height: '75vh',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflowX: 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                height: 350,
                                width: '100%',
                            }}
                        >
                            <StyledDataGrid
                                rows={upcomingAppointments}
                                columns={columns}
                                pageSize={5}
                                pageSizeOptions={[5, 10, 100]}
                                hideFooterSelectedRowCount
                                localeText={{ noRowsLabel: t('no_upcoming_appointments') }}
                                onRowClick={(params) => navigate(`/my-appointments/${params.row.appointmentId}/details`)}
                            />
                        </Box>
                    </Box>
                </TabPanel>
            )}
            {activeTab === 'history' && (
                <TabPanel value={activeTab} index="history">
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="status-label">{t('status_label')}</InputLabel>
                            <Select
                                labelId="status-label"
                                value={statusFilter}
                                onChange={handleStatusChange}
                                label={t('status_label')}
                            >
                                <MenuItem value="">{t('all')}</MenuItem>
                                <MenuItem value="CONFIRMED">{t('confirmed')}</MenuItem>
                                <MenuItem value="COMPLETED">{t('completed')}</MenuItem>
                                <MenuItem value="CANCELLED">{t('cancelled')}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <TextField
                                type="date"
                                value={dateFilter}
                                onChange={handleDateChange}
                            />
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="modality-label">{t('modality_label')}</InputLabel>
                            <Select
                                labelId="modality-label"
                                value={modalityFilter}
                                onChange={handleModalityChange}
                                label={t('modality_label')}
                            >
                                <MenuItem value="">{t('all')}</MenuItem>
                                <MenuItem value="VIRTUAL">{t('virtual')}</MenuItem>
                                <MenuItem value="IN_PERSON">{t('in_person')}</MenuItem>
                            </Select>
                        </FormControl>
                        {(statusFilter || dateFilter || modalityFilter) && (
                            <Tooltip title={t('clear_button')}>
                                <IconButton
                                    onClick={handleClearFilters}
                                    sx={{ mt: 2 }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    <Box
                        sx={{
                            height: '75vh',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflowX: 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                height: 350,
                                width: '100%',
                            }}
                        >
                            <StyledDataGrid
                                rows={pastAppointments}
                                columns={columns}
                                pageSize={5}
                                pageSizeOptions={[5, 10, 100]}
                                hideFooterSelectedRowCount
                                localeText={{ noRowsLabel: t('no_past_appointments') }}
                                onRowClick={(params) => navigate(`/my-appointments/${params.row.appointmentId}/details`)}
                            />
                        </Box>
                    </Box>
                </TabPanel>
            )}
            {activeTab === 'today' && (
                <TabPanel value={activeTab} index="today">
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="status-label">{t('status_label')}</InputLabel>
                            <Select
                                labelId="status-label"
                                value={statusFilter}
                                onChange={handleStatusChange}
                                label={t('status_label')}
                            >
                                <MenuItem value="">{t('all')}</MenuItem>
                                <MenuItem value="CONFIRMED">{t('confirmed')}</MenuItem>
                                <MenuItem value="COMPLETED">{t('completed')}</MenuItem>
                                <MenuItem value="CANCELLED">{t('cancelled')}</MenuItem>
                            </Select>
                        </FormControl>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="modality-label">{t('modality_label')}</InputLabel>
                            <Select
                                labelId="modality-label"
                                value={modalityFilter}
                                onChange={handleModalityChange}
                                label={t('modality_label')}
                            >
                                <MenuItem value="">{t('all')}</MenuItem>
                                <MenuItem value="VIRTUAL">{t('virtual')}</MenuItem>
                                <MenuItem value="IN_PERSON">{t('in_person')}</MenuItem>
                            </Select>
                        </FormControl>
                        {(statusFilter || modalityFilter) && (
                            <Tooltip title={t('clear_button')}>
                                <IconButton
                                    onClick={handleClearFilters}
                                    sx={{ mt: 2 }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            </Tooltip>
                        )}
                    </Box>
                    <Box
                        sx={{
                            height: '75vh',
                            width: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            overflowX: 'auto',
                        }}
                    >
                        <Box
                            sx={{
                                height: 350,
                                width: '100%',
                            }}
                        >
                            <StyledDataGrid
                                rows={todayAppointments}
                                columns={columns}
                                pageSize={5}
                                pageSizeOptions={[5, 10, 100]}
                                hideFooterSelectedRowCount
                                localeText={{ noRowsLabel: t('no_today_appointments') }}
                                onRowClick={(params) => navigate(`/my-appointments/${params.row.appointmentId}/details`)}
                            />
                        </Box>
                    </Box>
                </TabPanel>
            )}
            <Modal
                open={showModal}
                onClose={closeModal}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    width: '100%',
                    maxWidth: '400px',
                    margin: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    mt: 6
                }}>
                    <RateAppointmentForm appointmentId={appointmentId} closeModal={closeModal} isUpdate={isUpdate} />
                </Box>
            </Modal>
        </Box>
    );
};