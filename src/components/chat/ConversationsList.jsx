import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Grid, IconButton, Paper, Typography, TextField, InputAdornment, Tooltip, Dialog, DialogActions, DialogContent, DialogContentText } from '@mui/material';
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
    const [openDialog, setOpenDialog] = useState(false);
    const [conversationToDelete, setConversationToDelete] = useState(null);
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

    const handleOpenDialog = (id) => {
        setConversationToDelete(id);
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setConversationToDelete(null);
    };

    const handleDelete = async () => {
        try {
            await deleteConversation(conversationToDelete);
            const updatedConversations = conversations.filter(conversation => conversation.id !== conversationToDelete);
            setConversations(updatedConversations);
            onConversationsLoaded(updatedConversations);
            handleCloseDialog();
            navigate('/chat');
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
            {conversations.length > 0 && (
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
                                    {conversation.last_message &&
                                        <Typography variant="body1" sx={{ color: '#555', marginTop: 1 }}>
                                            {new Date(conversation.last_message).toLocaleString()}
                                        </Typography>
                                    }

                                </Grid>
                                <Grid item xs={12} sm={3} container justifyContent="flex-end">
                                    <Tooltip title={t('delete_button')}>
                                        <IconButton color="default" aria-label="delete conversation" onClick={(e) => { e.stopPropagation(); handleOpenDialog(conversation.id); }}>
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
                    {searchTerm ? t('no_search_results') : t('no_conversations')}
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
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {t('confirm_delete')}
                    </DialogContentText>
                </DialogContent>
                <DialogActions sx={{ justifyContent: 'center' }}>
                    <Button onClick={handleCloseDialog} color="primary">
                        {t('cancel_button')}
                    </Button>
                    <Button onClick={handleDelete} color="error" autoFocus>
                        {t('delete_button')}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}