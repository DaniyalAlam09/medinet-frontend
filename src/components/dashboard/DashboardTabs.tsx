import React from 'react';
import {
    Card,
    Box,
    Tabs,
    Tab,
    Typography,
    Button,
    Skeleton,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export interface TabConfig {
    label: string;
    content: React.ReactNode;
    actionButton?: {
        label: string;
        onClick: () => void;
        icon?: React.ReactNode;
    };
}

interface DashboardTabsProps {
    tabs: TabConfig[];
    value: number;
    onChange: (event: React.SyntheticEvent, newValue: number) => void;
    loading?: boolean;
    title?: string;
    sx?: SxProps<Theme>;
}

const DashboardTabs: React.FC<DashboardTabsProps> = ({
    tabs,
    value,
    onChange,
    loading = false,
    title,
    sx = {}
}) => {
    const currentTab = tabs[value];

    return (
        <Card sx={sx}>
            {title && (
                <Box sx={{ p: 3, pb: 0 }}>
                    <Typography variant="h6" gutterBottom>
                        {title}
                    </Typography>
                </Box>
            )}

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={value}
                    onChange={onChange}
                    aria-label="dashboard tabs"
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabs.map((tab, index) => (
                        <Tab
                            key={index}
                            label={tab.label}
                            id={`dashboard-tab-${index}`}
                            aria-controls={`dashboard-tabpanel-${index}`}
                        />
                    ))}
                </Tabs>
            </Box>

            {loading ? (
                <Box sx={{ p: 3 }}>
                    <Skeleton variant="rectangular" height={200} />
                </Box>
            ) : (
                <Box sx={{ p: 3 }}>
                    {tabs.map((tab, index) => (
                        <div
                            key={index}
                            role="tabpanel"
                            hidden={value !== index}
                            id={`dashboard-tabpanel-${index}`}
                            aria-labelledby={`dashboard-tab-${index}`}
                        >
                            {value === index && (
                                <Box>
                                    {currentTab.actionButton && (
                                        <Box sx={{
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            mb: 3
                                        }}>
                                            <Typography variant="h6">
                                                {currentTab.label}
                                            </Typography>
                                            <Button
                                                variant="contained"
                                                startIcon={currentTab.actionButton.icon}
                                                onClick={currentTab.actionButton.onClick}
                                            >
                                                {currentTab.actionButton.label}
                                            </Button>
                                        </Box>
                                    )}
                                    {tab.content}
                                </Box>
                            )}
                        </div>
                    ))}
                </Box>
            )}
        </Card>
    );
};

export default DashboardTabs;
export type { DashboardTabsProps, TabConfig };
