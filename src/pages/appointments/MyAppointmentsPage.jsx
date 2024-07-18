import React, { useState, useEffect, useContext } from 'react';
import { getAppointmentsByWorker, getAppointmentsByClient } from '../../api/appointments.api';
import { AuthContext } from '../../contexts/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useMediaQuery } from '@mui/material';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const StyledDataGrid = styled(DataGrid)({
    backgroundColor: '#FFFFFF',
    cursor: 'pointer',
});

export const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
    const { user } = useContext(AuthContext);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const navigate = useNavigate();

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
                    onRowClick={(params) => navigate(`/my-appointments/${params.row.appointmentId}/details`)}
                />
            </Box>
        </Box>
    );
};