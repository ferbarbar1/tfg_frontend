import React, { useState, useEffect, useContext } from 'react';
import { getAppointmentsByWorker, getAppointmentsByClient } from '../../api/appointments.api';
import { Container, Table, Button } from 'react-bootstrap';
import { AuthContext } from '../../contexts/AuthContext';

export const MyAppointmentsPage = () => {
    const [appointments, setAppointments] = useState([]);
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
                    setAppointments(response.data);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [user.id, user.user.role]);

    return (
        <Container>
            <h2 className="mt-5 mb-3 text-center">My Appointments</h2>
            <Table striped bordered hover>
                <thead>
                    <tr>
                        <th className="text-center">Date</th>
                        <th className="text-center">Time</th>
                        <th className="text-center">{user.user.role === 'client' ? 'Worker' : 'Client'}</th>
                        <th className="text-center">Description</th>
                        <th className="text-center">Status</th>
                        <th className="text-center">Modality</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {appointments.map((appointment) => (
                        <tr key={appointment.id}>
                            <td className="text-center">{appointment.schedule.date}</td>
                            <td className="text-center">{appointment.schedule.start_time} - {appointment.schedule.end_time}</td>
                            <td className="text-center">
                                {user.user.role === 'client' ?
                                    `${appointment.worker.user.first_name} ${appointment.worker.user.last_name}` :
                                    `${appointment.client.user.first_name} ${appointment.client.user.last_name}`
                                }
                            </td>
                            <td className="text-center">{appointment.description}</td>
                            <td className="text-center">{appointment.status}</td>
                            <td className="text-center">{appointment.modality}</td>
                            <td className="text-center">
                                {appointment.modality === 'VIRTUAL' && (
                                    <Button variant="primary" href={appointment.meeting_link} target="_blank">Join Meeting</Button>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
        </Container>
    );
};