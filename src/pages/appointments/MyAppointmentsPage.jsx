import React, { useState, useEffect, useContext } from 'react';
import { getAppointmentsByWorker, getAppointmentsByClient } from '../../api/appointments.api';
import { AuthContext } from '../../contexts/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { RateAppointmentForm } from '../../components/ratings/RateAppointmentForm';
import { useTheme } from '@mui/material/styles';

const StyledDataGrid = styled(DataGrid)({
    backgroundColor: '#FFFFFF',
});

export const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [appointmentId, setAppointmentId] = useState(null);
    const [isUpdate, setIsUpdate] = useState(false);
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

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

    const closeModal = () => {
        setShowModal(false);
    };

    const columns = [
        {
            field: 'service',
            headerName: 'Service',
            flex: 1,
            minWidth: 150,
            sortable: true,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center', wordWrap: 'break-word' }}>{params.value}</div>
        },
        {
            field: 'date',
            headerName: 'Date',
            flex: 1,
            minWidth: 120,
            sortable: true,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center' }}>{params.value}</div>
        },
        {
            field: 'time',
            headerName: 'Time',
            flex: 1,
            minWidth: 150,
            sortable: true,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center' }}>{params.value}</div>
        },
        !isMobile && {
            field: 'status',
            headerName: 'Status',
            flex: 1,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center' }}>{params.value}</div>
        },
        !isMobile && {
            field: 'modality',
            headerName: 'Modality',
            flex: 1,
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => <div style={{ textAlign: 'center' }}>{params.value}</div>
        },
        {
            field: 'actions',
            headerName: 'Actions',
            flex: 1,
            minWidth: 150,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <div style={{ textAlign: 'center' }}>
                    {params.row.modality === 'VIRTUAL' && params.row.status === 'PENDING' && (
                        <Button variant="contained" href={params.row.meeting_link} target="_blank">Join</Button>
                    )}
                    {user.user.role === 'client' && params.row.status === 'COMPLETED' && (
                        <Button variant="contained" onClick={() => { setAppointmentId(params.row.appointmentId); setIsUpdate(true); setShowModal(true); }}>Rate</Button>
                    )}
                </div>
            )
        },
    ].filter(Boolean);

    return (
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
                    rows={appointments}
                    columns={columns}
                    pageSize={5}
                    pageSizeOptions={[5, 10, 100]}
                    hideFooterSelectedRowCount
                    localeText={{ noRowsLabel: 'There are no appointments to display.' }}
                />
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
        </Box>
    );
};