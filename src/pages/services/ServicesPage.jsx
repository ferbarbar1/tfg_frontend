import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ServicesList } from '../../components/services/ServicesList';


export function ServicesPage() {
    const navigate = useNavigate();

    const handleCreateService = () => {
        navigate('/services/create');
    };

    return (
        <div>
            <h1>Services Page</h1>
            <button onClick={handleCreateService}>Create Service</button>
            <ServicesList />
        </div>
    );
}