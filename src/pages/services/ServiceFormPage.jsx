import React from 'react';
import { ServiceForm } from '../../components/services/ServiceForm';

export function ServiceFormPage({ isUpdate }) {

    return (
        <>
            <ServiceForm isUpdate={isUpdate} />
        </>
    );
}