import React, { useState, useEffect } from 'react';
import { getAllWorkers } from '../api/workers.api';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

export function WorkersList() {
    const navigate = useNavigate();
    const [workers, setWorkers] = useState([]);
    useEffect(() => {
        async function fetchWorkers() {
            try {
                const response = await getAllWorkers();
                setWorkers(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchWorkers();
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
            name: 'Salary',
            selector: row => row.salary,
            sortable: true,
        },
        {
            name: 'Specialty',
            selector: row => row.specialty,
            sortable: true,
        },
    ];

    // Función para manejar el clic en una fila
    const handleRowClick = (row) => {
        navigate(`/workers/${row.id}/update/`); // Redirige a la página del servicio
    };

    return <DataTable data={workers} columns={columns} pagination paginationPerPage={5} paginationRowsPerPageOptions={[5, 10]} onRowClicked={handleRowClick} customStyles={{
        rows: {
            style: {
                cursor: 'pointer', // Cambia el cursor a una mano
            },
        },
    }} />;
}