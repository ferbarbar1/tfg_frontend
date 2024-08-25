import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, Avatar, IconButton } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { styled } from '@mui/system';
import { getConversationsByParticipants, createConversation } from '../../api/conversations.api';
import { deleteUser } from '../../api/users.api';


const StyledTableRow = styled(TableRow)({
    '&:hover': {
        backgroundColor: '#f5f5f5',
        cursor: 'pointer',
    },
});

export function UsersList({ userType, fetchUsers }) {
    const navigate = useNavigate();
    const [users, setUsers] = useState([]);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('asc');
    const [orderBy, setOrderBy] = useState('username');

    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetchUsers();
                setUsers(response.data);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    }, [fetchUsers]);

    const handleRowClick = (row) => {
        navigate(`/${userType}/${row.id}/update/`);
    };

    const handleChangePage = (newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleSort = (property) => () => {
        const isAsc = orderBy === property && order === 'asc';
        setOrder(isAsc ? 'desc' : 'asc');
        setOrderBy(property);
    };

    const handleChat = async (event, user) => {
        event.stopPropagation();
        event.preventDefault();
        try {
            const participantIds = [user.user.id, user.user.id];
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

    const handleEdit = (event, user) => {
        event.stopPropagation();
        navigate(`/${userType}/${user.id}/update/`);
    };

    const handleDelete = async (event, user) => {
        event.stopPropagation();
        try {
            await deleteUser(user.user.id);

            setUsers(users.filter(u => u.id !== user.id));
        } catch (error) {
            console.error(error);
        }
    };

    const sortedUsers = [...users].sort((a, b) => {
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
                    {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
                        <StyledTableRow key={user.id} onClick={() => handleRowClick(user)}>
                            <TableCell align="center" style={{ display: 'flex', justifyContent: 'center' }}>
                                <Avatar src={user.user.image} />
                            </TableCell>
                            <TableCell align="center">{user.user.username}</TableCell>
                            <TableCell align="center">{user.user.first_name + ' ' + user.user.last_name}</TableCell>
                            <TableCell align="center">
                                <IconButton aria-label="chat" onClick={(event) => handleChat(event, user)}>
                                    <ChatIcon />
                                </IconButton>
                                <IconButton aria-label="edit" onClick={(event) => handleEdit(event, user)}>
                                    <EditIcon />
                                </IconButton>
                                <IconButton aria-label="delete" onClick={(event) => handleDelete(event, user)}>
                                    <DeleteIcon />
                                </IconButton>
                            </TableCell>
                        </StyledTableRow>
                    ))}
                    {sortedUsers.length === 0 && (
                        <TableRow>
                            <TableCell colSpan={3} align="center">
                                There are no {userType} to display.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
            <TablePagination
                rowsPerPageOptions={[5, 10, 25]}
                component="div"
                count={users.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </TableContainer>
    );
}