import React from 'react';
import { ServiceForm } from '../../components/services/ServiceForm';

export function ServiceFormPage({ isUpdate }) {

    return (
        <>
            <h1>{isUpdate ? 'Update Service' : 'Create Service'}</h1>
            <ServiceForm isUpdate={isUpdate} />
        </>
    );
}