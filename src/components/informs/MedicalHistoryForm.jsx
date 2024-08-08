import React, { useState, useContext } from "react";
import { useDropzone } from 'react-dropzone';
import { AuthContext } from '../../contexts/AuthContext';
import { createMedicalHistory } from '../../api/medical_histories.api';
import { Box, TextField, Button, Typography, Divider } from '@mui/material';

export const MedicalHistoryForm = ({ closeModal }) => {
    const { user } = useContext(AuthContext);
    const [description, setDescription] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);

    const onDrop = (acceptedFiles) => {
        setSelectedFile(acceptedFiles[0]);
    };

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: 'application/pdf',
        maxFiles: 1
    });

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const formData = new FormData();
            formData.append('description', description);
            formData.append('medical_report', selectedFile);
            formData.append('client', user.id);

            await createMedicalHistory(formData);
            closeModal();
        } catch (error) {
            console.error('Error creating medical history:', error);
        }
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography variant="h6" component="h2" align="center">
                Add Medical History
            </Typography>
            <Divider sx={{ my: 2, bgcolor: "grey" }} />
            <TextField
                margin="normal"
                required
                fullWidth
                id="description"
                label="Description"
                name="description"
                multiline
                rows={4}
                value={description}
                onChange={(event) => setDescription(event.target.value)}
            />
            <Box {...getRootProps()} sx={{ border: '2px dashed grey', padding: '20px', textAlign: 'center', marginTop: '16px' }}>
                <input {...getInputProps()} />
                {selectedFile ? (
                    <Typography>{selectedFile.name}</Typography>
                ) : (
                    <Typography>Drag and drop a PDF file here, or click to select one</Typography>
                )}
            </Box>
            <Box sx={{ mt: 3, mb: 2, display: 'flex', justifyContent: 'center' }}>
                <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                >
                    Save
                </Button>
                <Button
                    variant="contained"
                    color="error"
                    onClick={closeModal}
                    sx={{ ml: 2 }}
                >
                    Cancel
                </Button>
            </Box>
        </Box>
    );
};
