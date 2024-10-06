import axios from "axios";

const getToken = () => localStorage.getItem("token");

const axiosInstance = axios.create({
    baseURL: "http://127.0.0.1:8000/api/",
    headers: {
        Authorization: `Bearer ${getToken()}`,
    }
});

export const getAllInvoices = async () => {
    return axiosInstance.get("invoices/");
}

export const getInvoiceById = async (invoiceId) => {
    return axiosInstance.get(`invoices/${invoiceId}`);
}