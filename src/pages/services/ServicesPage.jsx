import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Carousel } from 'react-bootstrap';
import { getAllServices } from '../../api/services.api';
import { AuthContext } from '../../contexts/AuthContext';
import '../../styles/Carousel.css';


export function ServicesPage() {
    const { user } = useContext(AuthContext);
    const [services, setServices] = useState([]);
    const [index, setIndex] = useState(0);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await getAllServices();
                setServices(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchServices();
    }, []);

    const handleCreateService = () => {
        navigate('/services/create');
    };

    const handleSelect = (selectedIndex) => {
        setIndex(selectedIndex);
    };

    const handleClick = (serviceId) => {
        if (user.user.role === 'owner') {
            navigate(`/services/${serviceId}/update/`);
        }
        if (user.user.role === 'client') {
            navigate(`/services/${serviceId}/details/`);
        }
    };

    return (
        <div>
            <div style={{ textAlign: 'center' }}>
                <h1>Services Page</h1>
                {user && user.user && user.user.role === 'owner' &&
                    <Button variant="primary" onClick={handleCreateService}>Create Service</Button>
                }
            </div>
            <Carousel activeIndex={index} onSelect={handleSelect}>
                {services.map(service => (
                    <Carousel.Item key={service.id}>
                        <div style={{ width: '70%', marginLeft: 'auto', marginRight: 'auto', display: 'block' }}>
                            <img
                                className="service-image d-block w-100"
                                src={service.image}
                                alt={service.name}
                            />
                            <Carousel.Caption >
                                <h3>{service.name}</h3>
                                <p>{service.description}</p>
                                {user && user.user && user.user.role === 'owner' &&
                                    <Button variant="primary" onClick={() => handleClick(service.id)}>Edit</Button>
                                }
                                {user && user.user && user.user.role === 'client' &&
                                    <>
                                        <Button variant="primary" onClick={() => handleClick(service.id)}>View</Button>
                                    </>
                                }
                            </Carousel.Caption>
                        </div>
                    </Carousel.Item>
                ))}
            </Carousel>
        </div>
    );
}