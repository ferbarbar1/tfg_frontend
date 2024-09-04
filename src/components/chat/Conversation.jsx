import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, TextField, List, ListItem, ListItemText, Divider, Typography, Paper, IconButton, Tooltip } from '@mui/material';
import RefreshIcon from '@mui/icons-material/Refresh';
import SendIcon from '@mui/icons-material/Send';
import { getMessagesByConversationId, createMessage, getConversationById } from '../../api/conversations.api';
import { AuthContext } from '../../contexts/AuthContext';
import { getUserById } from '../../api/users.api';
import { useTranslation } from 'react-i18next';

export const Conversation = ({ refreshConversations }) => {
    const { conversationId } = useParams();
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [receiver, setReceiver] = useState(null);

    const { user } = useContext(AuthContext);
    const messagesEndRef = useRef(null);
    const messagesContainerRef = useRef(null);
    const { t } = useTranslation();

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
                const receiverId = response.data.participants.find(participant => participant !== user.user.id);
                const receiverData = await getUserById(receiverId);
                setReceiver(receiverData.data[0]);
            } catch (error) {
                console.error(error);
            }
        };

        fetchMessages();
        fetchConversationDetails();
    }, [conversationId, user.user.id]);

    useEffect(() => {
        if (messagesEndRef.current && messagesContainerRef.current) {
            messagesContainerRef.current.scrollTo({
                top: messagesEndRef.current.offsetTop,
                behavior: 'smooth',
            });
        }
    }, [messages]);

    const handleSendMessage = async () => {
        if (newMessage.trim() === '') return;

        try {
            await createMessage({ content: newMessage, conversation: conversationId, sender: user.user.id });
            setNewMessage('');
            const response = await getMessagesByConversationId(conversationId);
            setMessages(response.data);
            refreshConversations();
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
                <Typography variant="h5" textAlign="center" gutterBottom>
                    {t('chat_with')}: {receiver ? receiver.username : t('loading')}
                </Typography>
                <IconButton onClick={handleReload} aria-label={t('reload')}>
                    <RefreshIcon />
                </IconButton>
            </Box>
            <Box flex="1" overflow="auto" padding={2} bgcolor="#f5f5f5" ref={messagesContainerRef}>
                <Box maxWidth="lg" mx="auto">
                    <List>
                        {messages.length === 0 ? (
                            <ListItem>
                                <ListItemText
                                    primary={<Typography variant="body1" color="textSecondary" textAlign="center">{t('no_messages_yet')}</Typography>}
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
                        placeholder={t('type_a_message')}
                        fullWidth
                        variant="outlined"
                        margin="none"
                        style={{ marginRight: '10px' }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                handleSendMessage();
                            }
                        }}
                    />
                    <Tooltip title={t('send_message')} placement='top'>
                        <IconButton
                            onClick={handleSendMessage}
                            color="primary"
                            disabled={newMessage.trim() === ''}
                        >
                            <SendIcon />
                        </IconButton>
                    </Tooltip>
                </Box>
            </Box>
        </Box>
    );
};