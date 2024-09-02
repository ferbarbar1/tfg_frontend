import React, { useEffect, useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, IconButton, Typography, Tooltip, Card, CardContent, CardMedia, CardActionArea, TextField, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteResource, getAllResources } from '../../api/resources.api';
import { truncateText } from '../../utils/auxFunctions';
import { AuthContext } from '../../contexts/AuthContext';

export function ResourcesList() {
    const { user } = useContext(AuthContext);
    const [resources, setResources] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const resourcesPerPage = 6;
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchResources() {
            try {
                const response = await getAllResources();
                setResources(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchResources();
    }, []);

    const handleCreateResource = () => {
        navigate('/resources/create');
    };

    const handleEdit = (id) => {
        navigate(`/resources/${id}/update/`);
    };

    const handleDelete = async (id) => {
        try {
            await deleteResource(id);
            setResources(resources.filter(resource => resource.id !== id));
        } catch (error) {
            console.error(error);
        }
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const filteredResources = resources.filter(resource =>
        resource.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        resource.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastResource = currentPage * resourcesPerPage;
    const indexOfFirstResource = indexOfLastResource - resourcesPerPage;
    const currentResources = filteredResources.slice(indexOfFirstResource, indexOfLastResource);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredResources.length / resourcesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    return (
        <Box sx={{ mr: 3, ml: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3, mt: 2 }}>
                {resources.length > 0 && (
                    <TextField
                        label="Search"
                        variant="outlined"
                        value={searchTerm}
                        onChange={handleSearchChange}
                        sx={{ mr: 2 }}
                        InputProps={{
                            endAdornment: (
                                <InputAdornment position="end">
                                    {searchTerm && (
                                        <IconButton onClick={handleClearSearch}>
                                            <ClearIcon />
                                        </IconButton>
                                    )}
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                    />
                )}
                {user.user.role === 'owner' || user.user.role === 'worker' ? (
                    <Button variant="contained" sx={{ ml: 2 }} onClick={handleCreateResource}>
                        Create
                    </Button>) : null}
            </Box>
            {currentResources.length > 0 ? (
                <Grid container spacing={3}>
                    {currentResources.map((resource, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ width: 345, height: 400, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <CardActionArea>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={resource.image_preview}
                                        alt={resource.title}
                                    />
                                    <CardContent>
                                        <Typography gutterBottom variant="h5" component="div" title={resource.title}>
                                            {truncateText(resource.title, 20)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }} title={resource.description}>
                                            {truncateText(resource.description, 100)}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                                {user.user.role === 'owner' || resource.uploader === user.user.id ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                        <Tooltip title="Edit">
                                            <IconButton onClick={() => handleEdit(resource.id)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton onClick={() => handleDelete(resource.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </Box>
                                ) : null}
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            ) : (
                <Typography variant="h6" align="center" sx={{ color: '#777' }}>
                    No resources found.
                </Typography>
            )}
            {filteredResources.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                        Previous
                    </Button>
                    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredResources.length / resourcesPerPage)}>
                        Next
                    </Button>
                </Box>
            )}
        </Box>
    );
}