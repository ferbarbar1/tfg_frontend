import React from 'react';
import { ClientForm } from '../../components/users/ClientForm';

export function ClientDetailPage({ isUpdate }) {
    return (
        <ClientForm isUpdate={isUpdate} />
    );
}