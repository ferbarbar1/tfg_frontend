import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteClient } from '../api/clients.api';
import { ClientForm } from '../components/ClientForm';

export function ClientDetailPage({ isUpdate }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteClient(id);
            navigate('/users?tab=clients');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>{isUpdate ? 'View Client' : 'Create Client'}</h1>
            <ClientForm isUpdate={isUpdate} />
            {isUpdate && <button onClick={handleDelete}>Delete</button>}
        </div>
    );
}