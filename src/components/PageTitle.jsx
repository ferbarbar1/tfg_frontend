import React from "react";
import { Typography, Divider, Box } from '@mui/material';

export function PageTitle({ title }) {
    return (
        <Box>
            <Typography variant="h4" gutterBottom>
                {title}
            </Typography>
            <Divider sx={{ color: 'black' }} />
        </Box>
    );
}
