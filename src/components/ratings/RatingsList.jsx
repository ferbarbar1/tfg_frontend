import React, { useState, useEffect } from 'react';
import { getAllRatings } from '../../api/ratings.api';
import DataTable from 'react-data-table-component';

export function RatingsList() {
    const [ratings, setRatings] = useState([]);

    useEffect(() => {
        async function fetchServices() {
            try {
                const response = await getAllRatings();
                setRatings(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchServices();
    }, []);

    const columns = [
        {
            name: 'Service',
            selector: row => row.service,
            sortable: true,
        },
        {
            name: 'Client',
            selector: row => row.client,
            sortable: true,
        },
        {
            name: 'Worker',
            selector: row => row.worker,
            sortable: true,
        },
        {
            name: 'Rate',
            selector: row => row.rate,
            sortable: true,
        },
        {
            name: 'Opinion',
            selector: row => row.opinion,
            sortable: true,
        },
        {
            name: 'Date',
            selector: row => row.date,
            sortable: true,
        },

    ];


    return <DataTable data={ratings} columns={columns} pagination paginationPerPage={5} paginationRowsPerPageOptions={[5, 10]} />;
}