import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    }
});

export const getMessagesByConversationId = async (conversationId) => {
    return axiosInstance.get(`messages?conversation=${conversationId}`);
}

export const createMessage = async (messageData) => {
    return axiosInstance.post("messages/", messageData);
}

export const createConversation = async (conversationData) => {
    return axiosInstance.post("conversations/", conversationData);
}

export const getConversationsByParticipants = async (participantIds) => {
    return axiosInstance.get(`conversations?participants=${participantIds.join(',')}`);
}

export const getConversationById = async (conversationId) => {
    return axiosInstance.get(`conversations/${conversationId}`);
}

export const deleteConversation = async (conversationId) => {
    return axiosInstance.delete(`conversations/${conversationId}`);
}