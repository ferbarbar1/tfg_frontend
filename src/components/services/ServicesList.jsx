import React, { useState, useEffect } from 'react';
import { getAllServices } from '../../api/services.api';
import DataTable from 'react-data-table-component';
import { useNavigate } from 'react-router-dom';

export function ServicesList() {
    const [services, setServices] = useState([]);
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

    const columns = [
        {
            name: 'Name',
            selector: row => row.name,
            sortable: true,
        },
        {
            name: 'Description',
            selector: row => row.description,
            sortable: true,
        },
        {
            name: 'Price',
            selector: row => row.price,
            sortable: true,
        },
    ];

    // Función para manejar el clic en una fila
    const handleRowClick = (row) => {
        navigate(`/services/${row.id}/update/`); // Redirige a la página del servicio
    };

    return <DataTable data={services} columns={columns} pagination paginationPerPage={5} paginationRowsPerPageOptions={[5, 10]} onRowClicked={handleRowClick} customStyles={{
        rows: {
            style: {
                cursor: 'pointer', // Cambia el cursor a una mano
            },
        },
    }} />;
}