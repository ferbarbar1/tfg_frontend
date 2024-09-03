import React, { useEffect, useState, useContext } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ClearIcon from '@mui/icons-material/Clear';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Button, Grid, IconButton, Typography, Tooltip, Card, CardContent, CardMedia, CardActionArea, TextField, InputAdornment, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { deleteResource, getAllResources } from '../../api/resources.api';
import { truncateText } from '../../utils/auxFunctions';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export function ResourcesList() {
    const { t } = useTranslation();
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

    const handleResourceClick = (resource) => {
        if (resource.url) {
            window.open(resource.url, '_blank');
        } else if (resource.file) {
            window.open(resource.file, '_blank');
        }
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
                        label={t('search_label')}
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
                        {t('create_button')}
                    </Button>) : null}
            </Box>
            {currentResources.length > 0 ? (
                <Grid container spacing={3}>
                    {currentResources.map((resource, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                            <Card sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                                <CardActionArea sx={{ flexGrow: 1 }} onClick={() => handleResourceClick(resource)}>
                                    <CardMedia
                                        component="img"
                                        height="200"
                                        image={resource.image_preview}
                                        alt={resource.title}
                                    />
                                    <CardContent sx={{ flexGrow: 1 }}>
                                        <Typography gutterBottom variant="h5" component="div" title={resource.title}>
                                            {truncateText(resource.title, 20)}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'text.secondary' }} title={resource.description}>
                                            {truncateText(resource.description, 100)}
                                        </Typography>
                                        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                                            <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                                                <Avatar src={resource.author.image} alt={resource.author.username} sx={{ mr: 1 }} />
                                                <Typography variant="body2" sx={{ color: 'text.secondary' }} title={resource.author.username}>
                                                    {resource.author.username}
                                                </Typography>
                                            </Box>
                                            <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                                {new Date(resource.created_at).toLocaleString()}
                                            </Typography>
                                        </Box>
                                    </CardContent>
                                </CardActionArea>
                                {user.user.role === 'owner' || resource.author.id === user.user.id ? (
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', p: 2 }}>
                                        <Tooltip title={t('edit_button')}>
                                            <IconButton onClick={() => handleEdit(resource.id)}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('delete_button')}>
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
                    {t('no_resources_published')}
                </Typography>
            )}
            {filteredResources.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                        {t('previous')}
                    </Button>
                    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredResources.length / resourcesPerPage)}>
                        {t('next')}
                    </Button>
                </Box>
            )}
        </Box>
    );
}