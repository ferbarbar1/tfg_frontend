import React, { useState, useEffect, useContext } from 'react';
import { getAllClients } from '../../api/clients.api';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, Avatar, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import { styled } from '@mui/system';
import { getConversationsByParticipants, createConversation } from '../../api/conversations.api';
import { AuthContext } from '../../contexts/AuthContext';

const StyledTableRow = styled(TableRow)({
    '&:hover': {
        backgroundColor: '#f5f5f5',
        cursor: 'pointer',
    },
});

export function ClientsList() {
    const navigate = useNavigate();
    const [clients, setClients] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('username');
    const { user } = useContext(AuthContext);

    useEffect(() => {
        async function fetchClients() {
            try {
                const response = await getAllClients();
                setClients(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchClients();
    }, []);

    const handleRowClick = (row) => {
        navigate(`/clients/${row.id}/update/`);
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (property) => (event) => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChat = async (event, client) => {
        event.stopPropagation();
        event.preventDefault();
        try {
            const participantIds = [user.user.id, client.user.id];
            const response = await getConversationsByParticipants(participantIds);
            let conversationId;

            if (response.data.length > 0) {
                conversationId = response.data[0].id;
            } else {
                const newConversation = await createConversation({ participants: participantIds });
                conversationId = newConversation.data.id;
            }
            navigate(`/chat/${conversationId}`);
        } catch (error) {
            console.error(error);
        }
    };

    const sortedClients = [...clients].sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
            return a[orderBy] > b[orderBy] ? -1 : 1;
        }
    });

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell align="center"></TableCell>
                        <TableCell align="center">
                            <TableSortLabel
                                active={orderBy === 'username'}
                                direction={orderBy === 'username' ? order : 'asc'}
                                onClick={handleSort('username')}
                            >
                                <div style={{ textAlign: 'center' }}>Username</div>
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="center">
                            <TableSortLabel
                                active={orderBy === 'name'}
                                direction={orderBy === 'name' ? order : 'asc'}
                                onClick={handleSort('name')}
                            >
                                <div style={{ textAlign: 'center' }}>Name</div>
                            </TableSortLabel>
                        </TableCell>
                        <TableCell align="center">
                            Actions
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sortedClients.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((client) => (
                        <StyledTableRow key={client.id} onClick={() => handleRowClick(client)}>
                            <TableCell align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar src={client.user.image} />
                            </TableCell>
                            <TableCell align="center">{client.user.username}</TableCell>
                            <TableCell align="center">{client.user.first_name + ' ' + client.user.last_name}</TableCell>
                            <TableCell align="center">
                                <IconButton aria-label="chat">
                                    <ChatIcon onClick={(event) => handleChat(event, client)} />
                                </IconButton>
                            </TableCell>
                        </StyledTableRow>
                    ))}
                    {sortedClients.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                There are no clients to display.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={clients.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
}