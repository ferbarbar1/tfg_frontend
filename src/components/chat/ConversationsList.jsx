import React, { useEffect, useState, useContext } from 'react';
import { Box, Button, Divider, Grid, IconButton, Paper, Typography } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { getConversationsByParticipants, deleteConversation } from '../../api/conversations.api';
import { getUserById } from '../../api/users.api';
import { AuthContext } from '../../contexts/AuthContext';
import DeleteIcon from '@mui/icons-material/Delete';

export function ConversationsList() {
    const [conversations, setConversations] = useState([]);
    const { user } = useContext(AuthContext);
    const [receivers, setReceivers] = useState({});
    const [currentPage, setCurrentPage] = useState(1);
    const conversationsPerPage = 4;
    const navigate = useNavigate();

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
                    setConversations(conversationsResponse.data);
                    setReceivers(receiversMap);
                }
            } catch (error) {
                console.error("Error fetching conversations", error);
            }
        }
        fetchConversationsAndReceivers();
    }, [user.user.id]);

    const handleDelete = async (id) => {
        try {
            await deleteConversation(id);
            setConversations(conversations.filter(conversation => conversation.id !== id));
        } catch (error) {
            console.error("Error deleting conversation", error);
        }
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
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

    return (
        <Box sx={{ mr: 3, ml: 3 }}>
            <Typography variant="h3" align="center" gutterBottom sx={{ color: '#333', fontWeight: 'bold' }}>
                Conversations
            </Typography>
            <Divider sx={{ marginBottom: 3, bgcolor: 'black', height: 2 }} />
            {currentConversations.length > 0 ? (
                currentConversations.map((conversation, index) => (
                    <Paper
                        key={index}
                        elevation={3}
                        sx={{
                            padding: 3,
                            marginBottom: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
                        }}
                    >
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={9}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 'bold', color: '#1976d2', cursor: 'pointer', textDecoration: 'none' }}
                                    component={Link}
                                    to={`/chat/${conversation.id}`}
                                >
                                    {receivers[conversation.id] ? receivers[conversation.id].username : 'Unknown'}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#555', marginTop: 1 }}>
                                    Started on {formatDate(conversation.created_at)}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={3} container justifyContent="flex-end">
                                <IconButton color="default" aria-label="delete offer" onClick={() => handleDelete(conversation.id)}>
                                    <DeleteIcon />
                                </IconButton>
                            </Grid>
                        </Grid>
                    </Paper>
                ))
            ) : (
                <Typography variant="h6" align="center" sx={{ color: '#777' }}>
                    No conversations yet.
                </Typography>
            )}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                    Previous
                </Button>
                <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(conversations.length / conversationsPerPage)}>
                    Next
                </Button>
            </Box>
        </Box>
    );
}