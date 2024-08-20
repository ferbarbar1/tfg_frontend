import React, { useState, useEffect } from "react";
import { createInform, updateInform } from '../../api/informs.api';
import { getAppointment, updateAppointment } from '../../api/appointments.api';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';

export const InformForm = ({ appointmentId, closeModal }) => {
    const [informId, setInformId] = useState(null);
    const [relevantInformation, setRelevantInformation] = useState('');
    const [diagnostic, setDiagnostic] = useState('');
    const [treatment, setTreatment] = useState('');
    const [isUpdate, setIsUpdate] = useState(false);

    useEffect(() => {
        const fetchInform = async () => {
            try {
                const appointmentData = await getAppointment(appointmentId);
                const existingInform = appointmentData.data.inform;
                if (existingInform) {
                    setRelevantInformation(existingInform.relevant_information || '');
                    setDiagnostic(existingInform.diagnostic || '');
                    setTreatment(existingInform.treatment || '');
                    setIsUpdate(true);
                    setInformId(existingInform.id);
                }
            } catch (error) {
                console.error("Error fetching inform: ", error);
            }
        };

        fetchInform();
    }, [appointmentId]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const informData = {
                relevant_information: relevantInformation,
                diagnostic,
                treatment,
            };

            if (isUpdate) {
                await updateInform(informId, informData);
            } else {
                const createdInform = await createInform({ ...informData, appointment: appointmentId });
                const updatedAppointment = {
                    inform_id: createdInform.data.id,
                };
                await updateAppointment(appointmentId, updatedAppointment);
            }

            if (closeModal) {
                closeModal();
            }
        } catch (error) {
            console.error('Error creating or updating inform:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" component="h2" align="center">
                {isUpdate ? 'Edit Inform' : 'Add Inform'}
            </Typography>
            <Divider sx={{ my: 2, bgcolor: "grey" }} />
            <TextField
                margin="normal"
                fullWidth
                id="relevantInformation"
                label="Relevant Information"
                name="relevantInformation"
                multiline
                rows={3}
                value={relevantInformation}
                onChange={(event) => setRelevantInformation(event.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="diagnostic"
                label="Diagnostic"
                name="diagnostic"
                multiline
                rows={3}
                value={diagnostic}
                onChange={(event) => setDiagnostic(event.target.value)}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="treatment"
                label="Treatment"
                name="treatment"
                multiline
                rows={3}
                value={treatment}
                onChange={(event) => setTreatment(event.target.value)}
            />
            <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    {isUpdate ? 'Update' : 'Save'}
                </Button>
                {closeModal && (
                    <Button
                        variant="contained"
                        color="error"
                        onClick={closeModal}
                        sx={{ ml: 2 }}
                    >
                        Cancel
                    </Button>
                )}
            </Box>
        </Box>
    );
};
