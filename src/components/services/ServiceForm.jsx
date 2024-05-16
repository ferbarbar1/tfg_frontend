import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService, updateService, createService, deleteService } from '../../api/services.api';
import { getAllWorkers } from '../../api/workers.api';
import { Form, Button, Container, Row, Col, Card } from 'react-bootstrap';

export function ServiceForm({ isUpdate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [workers, setWorkers] = useState([]);
    const [image, setImage] = useState(null);
    const [imagePreviewUrl, setImagePreviewUrl] = useState('');
    const [allWorkers, setAllWorkers] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchServiceAndWorkers() {
            if (isUpdate) {
                try {
                    const serviceResponse = await getService(id);
                    const service = serviceResponse.data;
                    setName(service.name);
                    setDescription(service.description);
                    setPrice(service.price);
                    setWorkers(service.workers.map(worker => worker.toString()));
                    setImagePreviewUrl(service.image);
                } catch (error) {
                    console.error(error);
                }
            }

            try {
                const workersResponse = await getAllWorkers();
                setAllWorkers(workersResponse.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchServiceAndWorkers();
    }, [id, isUpdate]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        workers.forEach(worker => {
            formData.append('workers', worker);
        });
        if (image) {
            formData.append('image', image);
        }

        try {
            if (isUpdate) {
                await updateService(id, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            } else {
                await createService(formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });
            }
            navigate('/services');
        } catch (error) {
            console.error(error);
        }
    };

    const handleImageChange = (e) => {
        setImage(e.target.files[0]);
        setImagePreviewUrl(URL.createObjectURL(e.target.files[0]));
    };

    const handleDelete = async () => {
        try {
            await deleteService(id);
            navigate('/services');
        } catch (error) {
            console.error(error);
        }
    };


    return (
        <Container>
            <Row>
                <Col md={12}>
                    <Card>
                        <Card.Body>
                            <Form onSubmit={handleSubmit}>
                                <Row>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Name:</Form.Label>
                                            <Form.Control type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Description:</Form.Label>
                                            <Form.Control type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Price:</Form.Label>
                                            <Form.Control type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
                                        </Form.Group>
                                    </Col>
                                    <Col md={6}>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Workers:</Form.Label>
                                            <Form.Select multiple value={workers} onChange={(e) => setWorkers(Array.from(e.target.selectedOptions, option => option.value))}>
                                                {allWorkers.map(worker => (
                                                    <option key={worker.id} value={worker.id}>{worker.user.username}</option>
                                                ))}
                                            </Form.Select>
                                        </Form.Group>
                                        <Form.Group className="mb-3">
                                            <Form.Label>Image:</Form.Label>
                                            <Form.Control type="file" onChange={handleImageChange} />
                                            {imagePreviewUrl && <img src={imagePreviewUrl} alt="Previsualización del servicio" style={{ width: '40%', height: 'auto' }} />}
                                        </Form.Group>
                                    </Col>
                                </Row>
                                <div className="d-flex justify-content-center">
                                    <Button variant="primary" type="submit" className="mt-3">
                                        {isUpdate ? 'Update' : 'Create'}
                                    </Button>
                                    {isUpdate &&
                                        <Button variant="danger" className="mt-3 ms-2" onClick={handleDelete}>
                                            Delete
                                        </Button>
                                    }
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}