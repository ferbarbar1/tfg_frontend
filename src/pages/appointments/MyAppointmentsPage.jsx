import React, { useState, useEffect, useContext } from 'react';
import { getAppointmentsByWorker, getAppointmentsByClient } from '../../api/appointments.api';
import { createConversation, getConversationsByParticipants } from '../../api/conversations.api';
import { AuthContext } from '../../contexts/AuthContext';
import { DataGrid } from '@mui/x-data-grid';
import { Box, useMediaQuery, Tabs, Tab, TextField, MenuItem, InputLabel, FormControl, Select, Button, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import ChatIcon from '@mui/icons-material/Chat';
import { styled } from '@mui/system';
import { useTheme } from '@mui/material/styles';
import { useNavigate, useLocation } from 'react-router-dom';

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
    const activeTab = queryParams.get('tab') || 'upcoming';

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

    const handleChat = async (event, appointment) => {
        event.stopPropagation();
        event.preventDefault();
        try {
            let participantIds;
            if (user.user.role === 'client') {
                // Si el usuario es un cliente, la conversación es con el trabajador
                participantIds = [user.user.id, appointment.worker.user.id];
            } else if (user.user.role === 'worker') {
                // Si el usuario es un trabajador, la conversación es con el cliente
                participantIds = [user.user.id, appointment.client.user.id];
            }

            const response = await getConversationsByParticipants(participantIds);
            let conversationId;

            if (response.data.length > 0) {
                // Si ya existe una conversación, usa su ID
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
            minWidth: 100,
            align: 'center',
            headerAlign: 'center',
            renderCell: (params) => (
                <IconButton aria-label="chat">
                    <ChatIcon onClick={(event) => handleChat(event, params.row)} />
                </IconButton>
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
                <Tab value="upcoming" label="Upcoming Appointments" />
                <Tab value="history" label="Appointment History" />
            </Tabs>
            {activeTab === 'upcoming' && (
                <TabPanel value={activeTab} index="upcoming">
                    <Box sx={{ display: 'flex', flexDirection: 'row', gap: 2 }}>
                        <FormControl fullWidth sx={{ mt: 2 }}>
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={statusFilter}
                                onChange={handleStatusChange}
                                label="Status"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>
                                <MenuItem value="CANCELLED">Cancelled</MenuItem>
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
                            <InputLabel id="modality-label">Modality</InputLabel>
                            <Select
                                labelId="modality-label"
                                value={modalityFilter}
                                onChange={handleModalityChange}
                                label="Modality"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="VIRTUAL">Virtual</MenuItem>
                                <MenuItem value="IN_PERSON">In person</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setStatusFilter('');
                                setDateFilter('');
                                setModalityFilter('');
                            }}
                            sx={{ mt: 2 }}
                        >
                            <DeleteIcon />
                        </Button>
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
                                localeText={{ noRowsLabel: 'There are no appointments to display.' }}
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
                            <InputLabel id="status-label">Status</InputLabel>
                            <Select
                                labelId="status-label"
                                value={statusFilter}
                                onChange={handleStatusChange}
                                label="Status"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="CONFIRMED">Confirmed</MenuItem>
                                <MenuItem value="COMPLETED">Completed</MenuItem>
                                <MenuItem value="CANCELLED">Cancelled</MenuItem>
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
                            <InputLabel id="modality-label">Modality</InputLabel>
                            <Select
                                labelId="modality-label"
                                value={modalityFilter}
                                onChange={handleModalityChange}
                                label="Modality"
                            >
                                <MenuItem value="">All</MenuItem>
                                <MenuItem value="VIRTUAL">Virtual</MenuItem>
                                <MenuItem value="IN_PERSON">In person</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="contained"
                            onClick={() => {
                                setStatusFilter('');
                                setDateFilter('');
                                setModalityFilter('');
                            }}
                            sx={{ mt: 2 }}
                        >
                            <DeleteIcon />
                        </Button>
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
                                localeText={{ noRowsLabel: 'There are no appointments to display.' }}
                                onRowClick={(params) => navigate(`/my-appointments/${params.row.appointmentId}/details`)}
                            />
                        </Box>
                    </Box>
                </TabPanel>
            )}
        </Box>
    );
};
