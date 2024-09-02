import React, { useState, useEffect, useContext } from "react";
import { Box, Container, Grid, Card, CardHeader, Divider, CardContent, TextField, Button, FormControl, InputLabel, Select, MenuItem, IconButton, Typography } from "@mui/material";
import { useParams, useNavigate } from 'react-router-dom';
import { createResource, updateResource, getResource } from '../../api/resources.api';
import { AuthContext } from "../../contexts/AuthContext";
import DeleteIcon from '@mui/icons-material/Delete';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

export function ResourceForm({ isUpdate }) {
    const { user } = useContext(AuthContext);
    const [author, setAuthor] = useState("");
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [resourceType, setResourceType] = useState("");
    const [file, setFile] = useState(null);
    const [fileName, setFileName] = useState("");
    const [imagePreview, setImagePreview] = useState(null);
    const [imagePreviewName, setImagePreviewName] = useState("");
    const [url, setUrl] = useState("");
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchResource() {
            if (isUpdate) {
                try {
                    const response = await getResource(id);
                    const resource = response.data;
                    setAuthor(resource.author);
                    setTitle(resource.title);
                    setDescription(resource.description);
                    setResourceType(resource.resource_type);
                    setUrl(resource.url);
                } catch (error) {
                    console.error("Error fetching resource:", error);
                }
            }
        }
        fetchResource();
    }, [id, isUpdate]);

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        setFile(selectedFile);
        setFileName(selectedFile ? selectedFile.name : "");
    };

    const handleImagePreviewChange = (event) => {
        const selectedFile = event.target.files[0];
        setImagePreview(selectedFile);
        setImagePreviewName(selectedFile ? selectedFile.name : "");
    };

    const handleFileDiscard = () => {
        setFile(null);
        setFileName("");
    };

    const handleImagePreviewDiscard = () => {
        setImagePreview(null);
        setImagePreviewName("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        const resourceData = new FormData();

        resourceData.append('author', user.user.id);
        resourceData.append('title', title);
        resourceData.append('description', description);
        resourceData.append('resource_type', resourceType);

        if (resourceType === "URL") {
            resourceData.append('url', url);
        } else {
            resourceData.delete('url'); // Elimina la URL si el tipo de recurso es FILE
        }

        if (file) resourceData.append('file', file);
        if (imagePreview) resourceData.append('image_preview', imagePreview);

        try {
            if (id) {
                await updateResource(id, resourceData);
            } else {
                await createResource(resourceData);
            }
            navigate('/resources');
        } catch (error) {
            console.error("Error creating/updating resource:", error);
        }
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            height="80vh"
        >
            <Container>
                <Grid container spacing={3}>
                    <Grid item xs={12}>
                        <Card>
                            <CardHeader title={isUpdate ? 'Update Resource' : 'Create Resource'} sx={{ textAlign: 'center' }} />
                            <Divider sx={{ bgcolor: 'grey.800' }} />
                            <CardContent>
                                <form onSubmit={handleSubmit}>
                                    <Grid container spacing={3}>
                                        <Grid item xs={6}>
                                            <TextField label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            <TextField label="Description" value={description} onChange={(e) => setDescription(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                        </Grid>
                                        <Grid item xs={6}>
                                            <FormControl fullWidth required sx={{ mb: 2 }}>
                                                <InputLabel id="resource-type-label">Resource Type</InputLabel>
                                                <Select
                                                    labelId="resource-type-label"
                                                    value={resourceType}
                                                    onChange={(e) => setResourceType(e.target.value)}
                                                    label="Resource Type"
                                                >
                                                    <MenuItem value="FILE">File</MenuItem>
                                                    <MenuItem value="URL">URL</MenuItem>
                                                </Select>
                                            </FormControl>
                                            {resourceType === "URL" && (
                                                <TextField label="URL" value={url} onChange={(e) => setUrl(e.target.value)} required fullWidth sx={{ mb: 2 }} />
                                            )}
                                            {resourceType === "FILE" && (
                                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                                    <Button
                                                        variant="contained"
                                                        component="label"
                                                        startIcon={<CloudUploadIcon />}
                                                        sx={{ mr: 2 }}
                                                    >
                                                        Upload File
                                                        <input
                                                            type="file"
                                                            hidden
                                                            onChange={handleFileChange}
                                                        />
                                                    </Button>
                                                    {fileName && (
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Typography variant="body2" sx={{ mr: 2 }}>{fileName}</Typography>
                                                            <IconButton onClick={handleFileDiscard}>
                                                                <DeleteIcon />
                                                            </IconButton>
                                                        </Box>
                                                    )}
                                                </Box>
                                            )}
                                        </Grid>
                                        <Grid item xs={12}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mb: 2 }}>
                                                <Button
                                                    variant="contained"
                                                    component="label"
                                                    startIcon={<CloudUploadIcon />}
                                                    sx={{ mr: 2 }}
                                                >
                                                    Add Image Preview
                                                    <input
                                                        type="file"
                                                        hidden
                                                        onChange={handleImagePreviewChange}
                                                    />
                                                </Button>
                                                {imagePreviewName && (
                                                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                        <Typography variant="body2" sx={{ mr: 2 }}>{imagePreviewName}</Typography>
                                                        <IconButton onClick={handleImagePreviewDiscard}>
                                                            <DeleteIcon />
                                                        </IconButton>
                                                    </Box>
                                                )}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                    <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                                        <Button variant="contained" color="primary" type="submit">
                                            {isUpdate ? 'Update' : 'Create'}
                                        </Button>
                                    </Box>
                                </form>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}