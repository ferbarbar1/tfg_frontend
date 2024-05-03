import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getService, updateService, createService } from '../../api/services.api';
import { getAllWorkers } from '../../api/workers.api';

export function ServiceForm({ isUpdate }) {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [price, setPrice] = useState('');
    const [workers, setWorkers] = useState([]);
    const [allWorkers, setAllWorkers] = useState([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchService() {
            if (isUpdate) {
                try {
                    const response = await getService(id);
                    const service = response.data;
                    setName(service.name);
                    setDescription(service.description);
                    setPrice(service.price);
                    setWorkers(service.workers);
                } catch (error) {
                    console.error(error);
                }
            }
        }
        fetchService();
    }, [id, isUpdate]);

    useEffect(() => {
        async function fetchWorkers() {
            try {
                const response = await getAllWorkers();
                setAllWorkers(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchWorkers();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            if (isUpdate) {
                await updateService(id, { name, description, price: price.toString(), workers: workers.map(Number) });
            } else {
                await createService({ name, description, price: price.toString(), workers: workers.map(Number) });
            }
            navigate('/services');
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Name:
                <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
            </label>
            <label>
                Description:
                <input type="text" value={description} onChange={(e) => setDescription(e.target.value)} required />
            </label>
            <label>
                Price:
                <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            </label>
            <label>
                Workers:
                <select multiple value={workers} onChange={(e) => setWorkers(Array.from(e.target.selectedOptions, option => option.value))}>
                    {allWorkers.map(worker => (
                        <option key={worker.id} value={worker.id}>{worker.user.username}</option>
                    ))}
                </select>
            </label>
            <button type="submit">{isUpdate ? 'Update' : 'Create'}</button>
        </form>
    );
}