import axios from "axios";

export const getMessagesByConversationId = async (conversationId) => {
    return axios.get(`http://127.0.0.1:8000/api/messages?conversation=${conversationId}`);
}

export const createMessage = async (messageData) => {
    return axios.post("http://127.0.0.1:8000/api/messages/", messageData);
}

export const createConversation = async (conversationData) => {
    return axios.post("http://127.0.0.1:8000/api/conversations/", conversationData);
}

export const getConversationsByParticipants = async (participantIds) => {
    return axios.get(`http://127.0.0.1:8000/api/conversations?participants=${participantIds.join(',')}`);
}

export const getConversationById = async (conversationId) => {
    return axios.get(`http://127.0.0.1:8000/api/conversations/${conversationId}`);
}

export const deleteConversation = async (conversationId) => {
    return axios.delete(`http://127.0.0.1:8000/api/conversations/${conversationId}`);
}