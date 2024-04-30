import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteService } from '../api/services.api';
import { ServiceForm } from '../components/ServiceForm';

export function ServiceDetailPage({ isUpdate }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteService(id);
            navigate('/services');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>{isUpdate ? 'Update Service' : 'Create Service'}</h1>
            <ServiceForm isUpdate={isUpdate} />
            {isUpdate && <button onClick={handleDelete}>Delete</button>}
        </div>
    );
}