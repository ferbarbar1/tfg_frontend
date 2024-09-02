import axios from "axios";

export const getAllInvoices = async () => {
    return axios.get("http://127.0.0.1:8000/api/invoices/");
}

export const getInvoiceById = async (invoiceId) => {
    return axios.get(`http://127.0.0.1:8000/api/invoices/${invoiceId}`);
}