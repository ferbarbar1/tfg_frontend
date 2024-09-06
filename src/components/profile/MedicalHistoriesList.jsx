import React, { useState, useEffect, useContext } from 'react';
import { Typography, Button, Box, Modal, IconButton, Paper, Grid, TextField, Select, MenuItem, FormControl, InputLabel, Tooltip } from '@mui/material';
import { MedicalHistoryForm } from '../informs/MedicalHistoryForm';
import { getAllMedicalHistoriesByClient, deleteMedicalHistory } from '../../api/medicalHistories.api';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ClearIcon from '@mui/icons-material/Clear';
import { truncateText } from '../../utils/auxFunctions';
import { AuthContext } from '../../contexts/AuthContext';
import { useTranslation } from 'react-i18next';

export const MedicalHistoriesList = ({ user }) => {
    const { t } = useTranslation();
    const { user: authenticatedUser } = useContext(AuthContext);
    const [showModal, setShowModal] = useState(false);
    const [medicalHistories, setMedicalHistories] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const historiesPerPage = 3;
    const [isUpdate, setIsUpdate] = useState(false);
    const [historyId, setHistoryId] = useState(null);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [sortCriteria, setSortCriteria] = useState('date');

    const fetchMedicalHistories = async () => {
        if (user) {
            try {
                const response = await getAllMedicalHistoriesByClient(user.id);
                setMedicalHistories(response.data);
            } catch (error) {
                console.error('Error fetching medical histories:', error);
                setMedicalHistories([]);
            }
        }
    };

    useEffect(() => {
        fetchMedicalHistories();
    }, [user]);

    const handleSortChange = (event) => {
        setSortCriteria(event.target.value);
    };

    const sortedHistories = [...medicalHistories].sort((a, b) => {
        if (sortCriteria === 'date') {
            return new Date(b.date) - new Date(a.date);
        } else if (sortCriteria === 'title') {
            return a.title.localeCompare(b.title);
        }
        return 0;
    });

    const filteredHistories = sortedHistories.filter(history => {
        const historyDate = new Date(history.date);
        const start = startDate ? new Date(startDate) : null;
        const end = endDate ? new Date(endDate) : null;

        if (start && end) {
            return historyDate >= start && historyDate <= end;
        } else if (start) {
            return historyDate >= start;
        } else if (end) {
            return historyDate <= end;
        } else {
            return true;
        }
    });

    const indexOfLastHistory = currentPage * historiesPerPage;
    const indexOfFirstHistory = indexOfLastHistory - historiesPerPage;
    const currentHistories = filteredHistories.slice(indexOfFirstHistory, indexOfLastHistory);

    const handleNextPage = () => {
        if (currentPage < Math.ceil(filteredHistories.length / historiesPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteMedicalHistory(id);
            setMedicalHistories(medicalHistories.filter(history => history.id !== id));
        } catch (error) {
            console.error('Error deleting medical history:', error);
        }
    };

    const handleModalClose = () => {
        setShowModal(false);
        fetchMedicalHistories();
    };

    const handleClearFilters = () => {
        setStartDate(null);
        setEndDate(null);
    };

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: 3 }}>
            {authenticatedUser.user.id === user.user.id && (
                <Button variant="contained" color="primary" sx={{ mb: 2 }} onClick={() => { setIsUpdate(false); setShowModal(true); }}>
                    {t('add_button')}
                </Button>
            )}
            {currentHistories.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                    <FormControl sx={{ mr: 2 }}>
                        <InputLabel id="sort-label">{t('order_by')}</InputLabel>
                        <Select
                            labelId="sort-label"
                            value={sortCriteria}
                            onChange={handleSortChange}
                            label={t('order_by')}
                        >
                            <MenuItem value="date">{t('date')}</MenuItem>
                            <MenuItem value="title">{t('title')}</MenuItem>
                        </Select>
                    </FormControl>
                    <TextField
                        label={t('start_date')}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={startDate || ''}
                        onChange={(e) => setStartDate(e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    <TextField
                        label={t('end_date')}
                        type="date"
                        InputLabelProps={{ shrink: true }}
                        value={endDate || ''}
                        onChange={(e) => setEndDate(e.target.value)}
                        sx={{ mr: 2 }}
                    />
                    {(startDate || endDate) &&
                        <Tooltip title={t('clear_button')}>
                            <IconButton color="default" onClick={handleClearFilters}>
                                <ClearIcon />
                            </IconButton>
                        </Tooltip>
                    }

                </Box>
            )}
            {currentHistories.length > 0 ? (
                currentHistories.map((history, index) => (

                    <Paper
                        key={index}
                        elevation={3}
                        sx={{
                            padding: 3,
                            marginBottom: 3,
                            borderRadius: 2,
                            backgroundColor: '#fff',
                            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                            width: '100%',
                            maxWidth: '600px'
                        }}
                    >
                        <Grid container alignItems="center" spacing={2}>
                            <Grid item xs={12} sm={8}>
                                <Typography
                                    variant="h5"
                                    sx={{ fontWeight: 'bold', color: '#1976d2' }}
                                    title={history.title}
                                >
                                    {truncateText(history.title, 10)}
                                </Typography>
                                <Typography
                                    variant="subtitle1"
                                    title={history.description}
                                >
                                    {truncateText(history.description, 40)}
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#555', marginTop: 1 }}>
                                    {history.date}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} sm={4} container justifyContent="flex-end">
                                {history.medical_report && (
                                    <Tooltip title={t('view_report')}>
                                        <IconButton
                                            color="primary"
                                            aria-label={t('view_report')}
                                            onClick={() => window.open(history.medical_report, '_blank')}
                                        >
                                            <PictureAsPdfIcon />
                                        </IconButton>
                                    </Tooltip>
                                )}
                                {authenticatedUser.user.id === user.user.id && (
                                    <>
                                        <Tooltip title={t('edit')}>
                                            <IconButton color="primary" aria-label={t('edit')} onClick={() => { setHistoryId(history.id); setIsUpdate(true); setShowModal(true); }}>
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title={t('delete')}>
                                            <IconButton color="default" aria-label={t('delete')} onClick={() => handleDelete(history.id)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                )}
                            </Grid>
                        </Grid>
                    </Paper>
                ))
            ) : (
                <Typography variant="h6" align="center" sx={{ color: '#777' }}>
                    {t('no_histories')}
                </Typography>
            )}

            {filteredHistories.length > 0 && (
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                    <Button variant="contained" onClick={handlePreviousPage} disabled={currentPage === 1} sx={{ mr: 2 }}>
                        {t('previous')}
                    </Button>
                    <Button variant="contained" onClick={handleNextPage} disabled={currentPage === Math.ceil(filteredHistories.length / historiesPerPage)}>
                        {t('next')}
                    </Button>
                </Box>
            )}

            <Modal
                open={showModal}
                onClose={handleModalClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={{
                    width: '100%',
                    maxWidth: '400px',
                    margin: 'auto',
                    bgcolor: 'background.paper',
                    boxShadow: 24,
                    p: 4,
                    mt: 6
                }}>
                    <MedicalHistoryForm closeModal={handleModalClose} isUpdate={isUpdate} historyId={historyId} />
                </Box>
            </Modal>
        </Box >
    );
};