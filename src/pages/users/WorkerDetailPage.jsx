import React from 'react';
import { WorkerForm } from '../../components/users/WorkerForm';

export function WorkerDetailPage({ isUpdate }) {
    return (
        <WorkerForm isUpdate={isUpdate} />
    );
}