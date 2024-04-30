import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { deleteWorker } from '../api/workers.api';
import { WorkerForm } from '../components/WorkerForm';

export function WorkerDetailPage({ isUpdate }) {
    const { id } = useParams();
    const navigate = useNavigate();

    const handleDelete = async () => {
        try {
            await deleteWorker(id);
            navigate('/users?tab=workers');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div>
            <h1>{isUpdate ? 'View Worker' : 'Create Worker'}</h1>
            <WorkerForm isUpdate={isUpdate} />
            {isUpdate && <button onClick={handleDelete}>Delete</button>}
        </div>
    );
}