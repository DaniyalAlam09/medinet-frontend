import React from 'react';
import {
    Card,
    CardContent,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Typography,
    Box,
    Chip,
    Skeleton,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    CheckCircle as CheckCircleIcon,
    Warning as WarningIcon,
    Error as ErrorIcon,
    Info as InfoIcon,
    PersonAdd as PersonAddIcon,
    LocalHospital as HospitalIcon,
    Assignment as AssignmentIcon,
    Schedule as ScheduleIcon,
    Description as DescriptionIcon,
} from '@mui/icons-material';
import { SxProps, Theme } from '@mui/material/styles';

export interface Activity {
    id: string;
    type: string;
    message: string;
    timestamp: string;
    severity: 'success' | 'warning' | 'error' | 'info';
}

interface ActivityFeedProps {
    activities: Activity[];
    loading?: boolean;
    title?: string;
    maxItems?: number;
    sx?: SxProps<Theme>;
}

const ActivityFeed: React.FC<ActivityFeedProps> = ({
    activities,
    loading = false,
    title = 'Recent Activities',
    maxItems = 10,
    sx = {}
}) => {
    const getActivityIcon = (type: string) => {
        switch (type) {
            case 'hospital_registered':
                return <HospitalIcon />;
            case 'user_created':
            case 'doctor_added':
            case 'patient_added':
                return <PersonAddIcon />;
            case 'referral_created':
            case 'referral_received':
                return <AssignmentIcon />;
            case 'appointment_scheduled':
            case 'appointment_completed':
                return <ScheduleIcon />;
            case 'record_updated':
                return <DescriptionIcon />;
            case 'system_alert':
                return <WarningIcon />;
            default:
                return <NotificationsIcon />;
        }
    };

    const getSeverityIcon = (severity: string) => {
        switch (severity) {
            case 'success':
                return <CheckCircleIcon color="success" />;
            case 'warning':
                return <WarningIcon color="warning" />;
            case 'error':
                return <ErrorIcon color="error" />;
            case 'info':
            default:
                return <InfoIcon color="info" />;
        }
    };

    const getSeverityColor = (severity: string) => {
        switch (severity) {
            case 'success':
                return 'success.main';
            case 'warning':
                return 'warning.main';
            case 'error':
                return 'error.main';
            case 'info':
            default:
                return 'info.main';
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));

        if (diffInMinutes < 1) return 'Just now';
        if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
        if (diffInMinutes < 10080) return `${Math.floor(diffInMinutes / 1440)}d ago`;

        return date.toLocaleDateString();
    };

    const renderSkeletonItem = () => (
        <ListItem>
            <ListItemIcon>
                <Skeleton variant="circular" width={24} height={24} />
            </ListItemIcon>
            <ListItemText
                primary={<Skeleton variant="text" width="80%" />}
                secondary={<Skeleton variant="text" width="60%" />}
            />
        </ListItem>
    );

    const displayActivities = activities.slice(0, maxItems);

    return (
        <Card sx={sx}>
            <CardContent>
                <Typography variant="h6" gutterBottom>
                    {title}
                </Typography>

                {loading ? (
                    <List>
                        {Array.from({ length: 5 }).map((_, index) => (
                            <React.Fragment key={index}>
                                {renderSkeletonItem()}
                            </React.Fragment>
                        ))}
                    </List>
                ) : displayActivities.length === 0 ? (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                        <Typography variant="body2" color="text.secondary">
                            No recent activities
                        </Typography>
                    </Box>
                ) : (
                    <List>
                        {displayActivities.map((activity) => (
                            <ListItem key={activity.id} sx={{ px: 0 }}>
                                <ListItemIcon sx={{ minWidth: 40 }}>
                                    <Box sx={{ position: 'relative' }}>
                                        {getActivityIcon(activity.type)}
                                        <Box
                                            sx={{
                                                position: 'absolute',
                                                top: -2,
                                                right: -2,
                                                width: 12,
                                                height: 12,
                                                borderRadius: '50%',
                                                backgroundColor: getSeverityColor(activity.severity),
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            {getSeverityIcon(activity.severity)}
                                        </Box>
                                    </Box>
                                </ListItemIcon>
                                <ListItemText
                                    primary={
                                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <Typography variant="body2">
                                                {activity.message}
                                            </Typography>
                                            <Chip
                                                label={activity.severity}
                                                size="small"
                                                color={activity.severity as any}
                                                variant="outlined"
                                            />
                                        </Box>
                                    }
                                    secondary={
                                        <Typography variant="caption" color="text.secondary">
                                            {formatTimestamp(activity.timestamp)}
                                        </Typography>
                                    }
                                />
                            </ListItem>
                        ))}
                    </List>
                )}
            </CardContent>
        </Card>
    );
};

export default ActivityFeed;
export type { ActivityFeedProps, Activity };
