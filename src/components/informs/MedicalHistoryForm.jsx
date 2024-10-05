import React, { useState, useContext, useEffect } from "react";
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../../contexts/AuthContext';
import { createMedicalHistory, updateMedicalHistory, getMedicalHistory } from '../../api/medicalHistories.api';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';
import { useTranslation } from 'react-i18next';

export const MedicalHistoryForm = ({ closeModal, isUpdate, historyId }) => {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [isModified, setIsModified] = useState(false);
    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (isUpdate) {
            const fetchMedicalHistory = async () => {
                try {
                    const response = await getMedicalHistory(historyId);
                    const medicalHistory = response.data;
                    setTitle(medicalHistory.title);
                    setDescription(medicalHistory.description);
                } catch (error) {
                    console.error("Error fetching medical history:", error);
                }
            }
            fetchMedicalHistory();
        }
    }, [isUpdate, historyId]);

    const onDrop = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
        setIsModified(true);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'application/pdf',
        maxFiles: 1
    });

    const handleTitleChange = (event) => {
        setTitle(event.target.value);
        setIsModified(true);
    };

    const handleDescriptionChange = (event) => {
        setDescription(event.target.value);
        setIsModified(true);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const newErrors = {};

        if (!selectedFile) {
            newErrors.file = t('file_required');
        } else if (selectedFile.type !== 'application/pdf') {
            newErrors.file = t('file_format_error');
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        try {
            const formData = new FormData();
            formData.append('title', title);
            formData.append('description', description);
            if (selectedFile) {
                formData.append('medical_report', selectedFile);
            }
            formData.append('client', user.id);

            if (isUpdate) {
                await updateMedicalHistory(historyId, formData);
            } else {
                await createMedicalHistory(formData);
            }
            closeModal();
        } catch (error) {
            console.error('Error creating/updating medical history:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            <Typography variant="h6" component="h2" align="center">
                {isUpdate ? t('update_medical_history') : t('add_medical_history')}
            </Typography>
            <Divider sx={{ my: 2, bgcolor: "grey" }} />
            <TextField
                margin="normal"
                required
                fullWidth
                id="title"
                label={t('title')}
                name="title"
                value={title}
                onChange={handleTitleChange}
                error={!!errors.title}
                helperText={errors.title}
            />
            <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label={t('description_label')}
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={handleDescriptionChange}
                error={!!errors.description}
                helperText={errors.description}
            />
            <Box {...getRootProps()} sx={{ border: '2px dashed grey', padding: '20px', textAlign: 'center', marginTop: '16px' }}>
                <input {...getInputProps()} />
                {selectedFile ? (
                    <Typography>{selectedFile.name}</Typography>
                ) : (
                    <Typography>{t('drag_and_drop')}</Typography>
                )}
            </Box>
            {errors.file && <Typography color="error" sx={{ mt: 1 }}>{errors.file}</Typography>}
            <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
                {isUpdate && isModified && (
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {t('update_button')}
                    </Button>
                )}
                {!isUpdate && (
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                    >
                        {t('save_button')}
                    </Button>
                )}
                <Button
                    variant="contained"
                    color="error"
                    onClick={closeModal}
                    sx={{ ml: 2 }}
                >
                    {t('cancel_button')}
                </Button>
            </Box>
        </Box>
    );
};