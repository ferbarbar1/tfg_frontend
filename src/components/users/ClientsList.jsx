import React, { useState, useEffect } from 'react';
import { getAllClients } from '../../api/clients.api';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

export function ClientsList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    useEffect(() => {
        async function fetchClients() {
            try {
                const response = await getAllClients();
                setClients(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchClients();
    }, []);

    const columns = [
        {
            name: 'Username',
            selector: row => row.user.username,
            sortable: true,
        },
        {
            name: 'First Name',
            selector: row => row.user.first_name,
            sortable: true,
        },
        {
            name: 'Last Name',
            selector: row => row.user.last_name,
            sortable: true,
        },
        {
            name: 'Email',
            selector: row => row.user.email,
            sortable: true,
        },
        {
            name: 'Subscription Plan',
            selector: row => row.subscription_plan,
            sortable: true,
        },
    ];
    // Función para manejar el clic en una fila
    const handleRowClick = (row) => {
        navigate(`/clients/${row.id}/update/`); // Redirige a la página del servicio
    };

    return <DataTable data={clients} columns={columns} pagination paginationPerPage={5} paginationRowsPerPageOptions={[5, 10]} onRowClicked={handleRowClick} customStyles={{
        rows: {
            style: {
                cursor: 'pointer', // Cambia el cursor a una mano
            },
        },
    }} />;
}