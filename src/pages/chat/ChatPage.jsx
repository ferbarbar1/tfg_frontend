import React, { useState, useCallback } from 'react';
import { Box, Grid } from '@mui/material';
import { ConversationsList } from '../../components/chat/ConversationsList';
import { Conversation } from '../../components/chat/Conversation';
import { useParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

export const ChatPage = () => {
    const { t } = useTranslation();
    const { conversationId } = useParams();
    const [conversations, setConversations] = useState([]);

    const handleConversationsLoaded = (loadedConversations) => {
        setConversations(loadedConversations);
    };

    const refreshConversations = useCallback(() => {
        handleConversationsLoaded(conversations);
    }, [conversations]);

    return (
        <Box sx={{ height: '100vh', width: '100%' }}>
            <Grid container>
                <Grid item xs={12} md={4} sx={{ ml: 2 }}>
                    <ConversationsList onConversationsLoaded={handleConversationsLoaded} />
                </Grid>
                <Grid item xs={12} md={7}>
                    {conversationId ? (
                        <Conversation refreshConversations={refreshConversations} />
                    ) : (
                        <Box p={3}>
                            {conversations.length > 0 ? t('select_conversation') : null}
                        </Box>
                    )}
                </Grid>
            </Grid>
        </Box>
    );
};