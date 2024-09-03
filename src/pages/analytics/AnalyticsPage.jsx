import React, { useState } from 'react';
import { WorkersRatingsChart } from '../../components/analytics/WorkersRatingsChart';
import { ServicesRatingsChart } from '../../components/analytics/ServicesRatingsChart';
import { InvoicesChart } from '../../components/analytics/InvoicesChart';
import { Tabs, Tab, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export function AnalyticsPage() {
    const { t } = useTranslation();
    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <Box sx={{ width: '100%' }}>
            <Tabs value={value} onChange={handleChange} aria-label="tabs">
                <Tab label={t('worker_ratings')} />
                <Tab label={t('service_ratings')} />
                <Tab label={t('billing')} />
            </Tabs>
            <TabPanel value={value} index={0}>
                <WorkersRatingsChart />
            </TabPanel>
            <TabPanel value={value} index={1}>
                <ServicesRatingsChart />
            </TabPanel>
            <TabPanel value={value} index={2}>
                <InvoicesChart />
            </TabPanel>
        </Box>
    );
}

function TabPanel(props) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`tabpanel-${index}`}
            aria-labelledby={`tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ p: 3 }}>
                    <Typography>{children}</Typography>
                </Box>
            )}
        </div>
    );
}