import React, { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { VirtualAppointment } from '../../components/appointments/VirtualAppointment';
import { InformForm } from '../../components/informs/InformForm';
import { Box, Typography, Grid } from '@mui/material';
import { AuthContext } from '../../contexts/AuthContext';

export function VideoCallPage() {
    const { id } = useParams();
    const { user } = useContext(AuthContext);
    const role = user.user.role;
    const [informSaved, setInformSaved] = useState(false);

    const handleInformSaved = () => {
        setInformSaved(true);
    };

    return (
        <Box display="flex" justifyContent="center" flexDirection="column" alignItems="center">
            <Typography variant="h4" >
                Videocall for Appointment ID: {id}
            </Typography>
            <Grid container spacing={2} direction={role === 'worker' ? 'row' : 'column'}>
                <Grid item xs={role === 'worker' ? 6 : 12}>
                    <VirtualAppointment appointmentId={id} role={role} informSaved={informSaved} />
                </Grid>
                {role === 'worker' && (
                    <Grid item xs={4} sx={{ ml: 6, mt: 4 }}>
                        <InformForm appointmentId={id} onInformSaved={handleInformSaved} />
                    </Grid>
                )}
            </Grid>
        </Box >
    );
}