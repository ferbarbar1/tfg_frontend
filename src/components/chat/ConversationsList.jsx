import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Grid, IconButton, Paper, Typography, TextField, InputAdornment, Tooltip } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { getConversationsByParticipants, deleteConversation } from '../../api/conversations.api';
import { getUserById } from '../../api/users.api';
import { AuthContext } from '../../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';
import ClearIcon from '@mui/icons-material/Clear';
import { useTranslation } from 'react-i18next';

export function ConversationsList({ onConversationsLoaded }) {
    const { t } = useTranslation();
    const { user } = useContext(AuthContext);
    const [conversations, setConversations] = useState([]);
    const [receivers, setReceivers] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const [selectedConversationId, setSelectedConversationId] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const conversationsPerPage = 4;

    useEffect(() => {
        async function fetchConversationsAndReceivers() {
            try {
                const participantIds = [user.user.id];
                const conversationsResponse = await getConversationsByParticipants(participantIds);

                if (conversationsResponse.data.length > 0) {
                    const receiverPromises = conversationsResponse.data.map(async (conversation) => {
                        const receiverId = conversation.participants.find(participant => participant !== user.user.id);
                        const receiverData = await getUserById(receiverId);
                        return { conversationId: conversation.id, receiver: receiverData.data[0] };
                    });
                    const receiversData = await Promise.all(receiverPromises);
                    const receiversMap = receiversData.reduce((acc, { conversationId, receiver }) => {
                        acc[conversationId] = receiver;
                        return acc;
                    }, {});

                    // Solo actualizar el estado si las conversaciones han cambiado
                    if (JSON.stringify(conversationsResponse.data) !== JSON.stringify(conversations)) {
                        setConversations(conversationsResponse.data);
                        setReceivers(receiversMap);
                        onConversationsLoaded(conversationsResponse.data);
                    }
                }
            } catch (error) {
                console.error("Error fetching conversations", error);
            }
        }
        fetchConversationsAndReceivers();
    }, [user.user.id, onConversationsLoaded]);

    const handleDelete = async (id) => {
        try {
            await deleteConversation(id);
            const updatedConversations = conversations.filter(conversation => conversation.id !== id);
            setConversations(updatedConversations);
            onConversationsLoaded(updatedConversations);
        } catch (error) {
            console.error("Error deleting conversation", error);
        }
    };

    const indexOfLastOffer = currentPage * conversationsPerPage;
    const indexOfFirstOffer = indexOfLastOffer - conversationsPerPage;
    const currentConversations = conversations.slice(indexOfFirstOffer, indexOfLastOffer);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(conversations.length / conversationsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleConversationClick = (conversationId) => {
        setSelectedConversationId(conversationId);
        navigate(`/chat/${conversationId}`);
    };

    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
    };

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const filteredConversations = currentConversations.filter(conversation => {
        const receiver = receivers[conversation.id];
        return receiver && receiver.username.toLowerCase().includes(searchTerm.toLowerCase());
    });

    return (
        <Box sx={{ mr: 3, ml: 3 }}>
            {filteredConversations.length > 1 && (
                <TextField
                    label={t('search_label')}
                    variant="outlined"
                    fullWidth
                    value={searchTerm}
                    onChange={handleSearchChange}
                    sx={{ mb: 3 }}
                    InputProps={{
                        endAdornment: searchTerm && (
                            <InputAdornment position="end">
                                <Tooltip title={t('clear_button')} placement="top">
                                    <IconButton onClick={handleClearSearch}>
                                        <ClearIcon />
                                    </IconButton>
                                </Tooltip>
                            </InputAdornment>
                        )
                    }}
                />
            )}
            {filteredConversations.length > 0 ? (
                filteredConversations.map((conversation, index) => {
                    const isSelected = selectedConversationId === conversation.id;

                    return (
                        <Paper
                            key={index}
                            elevation={3}
                            sx={{
                                padding: 3,
                                marginBottom: 3,
                                borderRadius: 2,
                                backgroundColor: isSelected ? '#e3f2fd' : '#fff',
                                boxShadow: isSelected ? '0 4px 12px rgba(0, 0, 0, 0.2)' : '0 4px 8px rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer'
                            }}
                            onClick={() => handleConversationClick(conversation.id)}
                        >
                            <Grid container alignItems="center" spacing={2}>
                                <Grid item xs={12} sm={9}>
                                    <Typography
                                        variant="h5"
                                        sx={{ fontWeight: 'bold', color: '#1976d2', textDecoration: 'none' }}
                                    >
                                        {receivers[conversation.id] ? receivers[conversation.id].username : 'Unknown'}
                                    </Typography>
                                    <Typography variant="body1" sx={{ color: '#555', marginTop: 1 }}>
                                        {new Date(conversation.last_message).toLocaleString()}
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} sm={3} container justifyContent="flex-end">
                                    <Tooltip title={t('delete_button')}>
                                        <IconButton color="default" aria-label="delete conversation" onClick={() => handleDelete(conversation.id)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    </Tooltip>
                                </Grid>
                            </Grid>
                        </Paper>
                    );
                })
            ) : (
                <Typography variant="h6" align="center" sx={{ color: '#777' }}>
                    {t('no_conversations')}
                </Typography>
            )}
            {filteredConversations.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                        {t('previous')}
                    </Button>
                    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(conversations.length / conversationsPerPage)}>
                        {t('next')}
                    </Button>
                </Box>
            )}
        </Box>
    );
}