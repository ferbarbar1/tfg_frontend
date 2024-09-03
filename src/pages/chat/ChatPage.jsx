import React, { useState } from 'react';
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

    return (
        <Box sx={{ height: '100vh', width: '100%' }}>
            <Grid container>
                <Grid item xs={12} md={conversations.length > 0 ? 4 : 12} sx={{ ml: 2 }}>
                    <ConversationsList onConversationsLoaded={handleConversationsLoaded} />
                </Grid>
                {conversations.length > 0 && (
                    <Grid item xs={12} md={7}>
                        {conversationId ? (
                            <Conversation />
                        ) : (
                            <Box p={3}>{t('select_conversation')}</Box>
                        )}
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};