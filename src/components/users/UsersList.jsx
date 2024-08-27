import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TablePagination, TableSortLabel, Avatar, IconButton, TextField, Box, InputAdornment } from '@mui/material';
import ChatIcon from '@mui/icons-material/Chat';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
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
    const [searchTerm, setSearchTerm] = useState('');

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

    const handleChangePage = (event, newPage) => {
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

    const handleClearSearch = () => {
        setSearchTerm('');
    };

    const filteredUsers = users.filter(user =>
        user.user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user.first_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.user.last_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedUsers = [...filteredUsers].sort((a, b) => {
        if (order === 'asc') {
            return a[orderBy] < b[orderBy] ? -1 : 1;
        } else {
            return a[orderBy] > b[orderBy] ? -1 : 1;
        }
    });

    return (
        <Box>
            <Box display="flex" alignItems="center" sx={{ mt: 2, mb: 2, ml: 1 }}>
                <TextField
                    label="Search"
                    variant="outlined"
                    margin="normal"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    size="small"
                    InputProps={{
                        endAdornment: (
                            <InputAdornment position="end">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    sx={{ width: '300px' }}
                />
                {searchTerm && (
                    <IconButton
                        onClick={handleClearSearch}
                        sx={{ ml: 1, mt: 1 }}
                    >
                        <ClearIcon />
                    </IconButton>
                )}
            </Box>
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
                                        <ChatIcon color='action' />
                                    </IconButton>
                                    <IconButton aria-label="edit" onClick={(event) => handleEdit(event, user)}>
                                        <EditIcon color='info' />
                                    </IconButton>
                                    <IconButton aria-label="delete" onClick={(event) => handleDelete(event, user)}>
                                        <DeleteIcon color='error' />
                                    </IconButton>
                                </TableCell>
                            </StyledTableRow>
                        ))}
                        {sortedUsers.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={4} align="center">
                                    There are no {userType} to display.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={filteredUsers.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </TableContainer>
        </Box>
    );
}