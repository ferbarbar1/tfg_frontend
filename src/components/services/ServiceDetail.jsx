import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getService } from '../../api/services.api';
import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
import Modal from "react-modal";
import { AppointmentForm } from '../appointments/AppointmentForm';

export function ServiceDetail() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [workers, setWorkers] = useState([]);
    const [appointmentModalOpen, setAppointmentModalOpen] = useState(false);
    const { id } = useParams();

    useEffect(() => {
        async function fetchService() {
            try {
                const serviceResponse = await getService(id);
                const service = serviceResponse.data;
                setName(service.name);
                setDescription(service.description);
                setPrice(service.price);
                setWorkers(service.workers);
            } catch (error) {
                console.error(error);
            }
        }
        fetchService();
    }, [id]);
    return (
        <Container className="mt-5">
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Header as="h2" className="text-center">{name}</Card.Header>
                        <Card.Body>
                            <Card.Title className="text-center">Price: {price} €/hour</Card.Title>
                            <Card.Text className="text-center">{description}</Card.Text>
                            <Card.Text className="text-center">Specialists working on this service:</Card.Text>
                            <ListGroup>
                                {workers.map((worker, index) => (
                                    <ListGroup.Item key={index} className="text-center">{worker.user.first_name} {worker.user.last_name}</ListGroup.Item>
                                ))}
                            </ListGroup>
                            <div className="d-flex justify-content-center mt-3">
                                <Button variant="primary" onClick={() => setAppointmentModalOpen(true)}>Book</Button>
                                <Modal
                                    isOpen={appointmentModalOpen}
                                    onRequestClose={() => setAppointmentModalOpen(false)}
                                    className="modalContent"
                                >
                                    <div className="modalHeader">
                                        <h2>Book an appointment</h2>
                                    </div>
                                    <div className="modalBody">
                                        <AppointmentForm closeModal={() => setAppointmentModalOpen(false)} serviceId={id} />
                                    </div>
                                </Modal>

                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}