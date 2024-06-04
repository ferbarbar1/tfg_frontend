import React, { useState, useEffect, useContext } from 'react';
import { getAppointmentsByWorker, getAppointmentsByClient } from '../../api/appointments.api';
import { AuthContext } from '../../contexts/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box, Button, Modal } from '@mui/material';
import { styled } from '@mui/system';
import { RateServiceForm } from '../../components/ratings/RateServiceForm';

const StyledDataGrid = styled(DataGrid)({
    '& .MuiDataGrid-row:nth-of-type(odd)': {
        backgroundColor: '#f7f7f7', // color para filas impares
    },
    '& .MuiDataGrid-row:nth-of-type(even)': {
        backgroundColor: '#FFFFFF', // color para filas pares
    },
});

export const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [serviceId, setServiceId] = useState(null);
    const { user } = useContext(AuthContext);

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
                        service: appointment.service.name,
                        date: new Date(appointment.schedule.date).toLocaleDateString(),
                        clientWorker: user.user.role === 'client' ? `${appointment.worker.user.first_name} ${appointment.worker.user.last_name}` : `${appointment.client.user.first_name} ${appointment.client.user.last_name}`,
                        time: `${appointment.schedule.start_time.split(':').slice(0, 2).join(':')} - ${appointment.schedule.end_time.split(':').slice(0, 2).join(':')}`
                    })));
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [user.id, user.user.role]);

    const columns = [
        { field: 'service', headerName: 'Service', width: 200, sortable: true, align: 'left' },
        { field: 'date', headerName: 'Date', width: 100, sortable: true, align: 'left' },
        { field: 'time', headerName: 'Time', width: 150, sortable: true, align: 'left' },
        { field: 'clientWorker', headerName: user.user.role === 'client' ? 'Worker' : 'Client', width: 150, sortable: true, align: 'left' },
        { field: 'description', headerName: 'Description', width: 200, align: 'left' },
        { field: 'status', headerName: 'Status', width: 150, align: 'left' },
        { field: 'modality', headerName: 'Modality', width: 150, align: 'left' },
        {
            field: 'actions',
            headerName: 'Actions',
            width: 150,
            align: 'left',
            renderCell: (params) => (
                <>
                    {params.row.modality === 'VIRTUAL' && params.row.status === 'PENDING' && (
                        <Button variant="contained" href={params.row.meeting_link} target="_blank">Join Meeting</Button>
                    )}
                    {user.user.role === 'client' && params.row.status === 'COMPLETED' && (
                        <Button variant="contained" onClick={() => { setShowModal(true); setServiceId(params.row.id); }}>Rate</Button>
                    )}
                </>
            )
        },
    ];

    return (
        <Box sx={{ height: 350, width: '100%' }}>
            <StyledDataGrid
                rows={appointments}
                columns={columns}
                pageSize={5}
                pageSizeOptions={[5, 10, 100]}
                hideFooterSelectedRowCount
            />
            <Modal
                open={showModal}
                onClose={() => setShowModal(false)}
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

                    <RateServiceForm serviceId={serviceId} />
                </Box>
            </Modal>
        </Box>
    );
};