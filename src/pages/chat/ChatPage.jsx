import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, Button, List, ListItem, ListItemText, Divider, Typography, Paper, IconButton } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import { getMessagesByConversationId, createMessage, getConversationById } from '../../api/conversations.api';
import { AuthContext } from '../../contexts/AuthContext';

export const ChatPage = () => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [reciever, setReciever] = useState('');

    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await getMessagesByConversationId(conversationId);
                setMessages(response.data);
            } catch (error) {
                console.error(error);
            }
        };

        const fetchConversationDetails = async () => {
            try {
                const response = await getConversationById(conversationId);
                const receiver_user = response.data.participants.filter(participant => participant !== user.user.id)[0];
                setReciever(receiver_user);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();
        fetchConversationDetails();
    }, [conversationId]);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            await createMessage({ content: newMessage, conversation: conversationId, sender: user.user.id });
            setNewMessage('');
            const response = await getMessagesByConversationId(conversationId);
            setMessages(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    const handleReload = () => {
        window.location.reload();
    };

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    return (
        <Box display="flex" flexDirection="column" height="85vh" maxWidth="md" mx="auto">
            <Box display="flex" justifyContent="space-between" alignItems="center" padding={2} bgcolor="#f5f5f5">
                <Typography variant="h5" textAlign="center" gutterBottom> Conversation with: {reciever}</Typography>
                <IconButton onClick={handleReload} aria-label="reload">
                    <RefreshIcon />
                </IconButton>
            </Box>
            <Box flex="1" overflow="auto" padding={2} bgcolor="#f5f5f5">
                <Box maxWidth="lg" mx="auto">
                    <List>
                        {messages.length === 0 ? (
                            <ListItem>
                                <ListItemText
                                    primary={<Typography variant="body1" color="textSecondary" textAlign="center">No messages yet</Typography>}
                                />
                            </ListItem>
                        ) : (
                            messages.map((msg, index) => (
                                <React.Fragment key={index}>
                                    <ListItem alignItems="flex-start" style={{ justifyContent: msg.sender === user.user.id ? 'flex-end' : 'flex-start' }}>
                                        <Paper
                                            elevation={3}
                                            style={{
                                                padding: '10px',
                                                borderRadius: '8px',
                                                backgroundColor: msg.sender === user.user.id ? '#d1e7dd' : '#cce5ff',
                                                maxWidth: '100%',
                                            }}
                                        >
                                            <ListItemText
                                                primary={<Typography variant="body1">{msg.content}</Typography>}
                                                secondary={
                                                    <Typography variant="caption" color="textSecondary">
                                                        {formatDate(msg.timestamp)}
                                                    </Typography>
                                                }
                                            />
                                        </Paper>
                                    </ListItem>
                                    <Divider />
                                </React.Fragment>
                            ))
                        )}
                        <div ref={messagesEndRef} />
                    </List>
                </Box>
            </Box>
            <Box padding={2} borderTop="1px solid #ccc" bgcolor="#fff">
                <Box display="flex" alignItems="center">
                    <TextField
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message"
                        fullWidth
                        variant="outlined"
                        margin="none"
                        style={{ marginRight: '10px' }}
                    />
                    <Button
                        onClick={handleSendMessage}
                        variant="contained"
                        color="primary"
                        disabled={newMessage.trim() === ''}
                    >
                        Send
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};