import React from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Chip,
    LinearProgress,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

interface StatsCardProps {
    title: string;
    value: string | number;
    subtitle?: string;
    icon?: React.ReactNode;
    color?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
    trend?: {
        value: number;
        label: string;
        isPositive?: boolean;
    };
    progress?: {
        value: number;
        label?: string;
    };
    chip?: {
        label: string;
        color?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
        icon?: React.ReactNode;
    };
    sx?: SxProps<Theme>;
}

const StatsCard: React.FC<StatsCardProps> = ({
    title,
    value,
    subtitle,
    icon,
    color = 'primary',
    trend,
    progress,
    chip,
    sx = {}
}) => {
    return (
        <Card sx={{ height: '100%', ...sx }}>
            <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    {icon && (
                        <Box sx={{ mr: 1, color: `${color}.main` }}>
                            {icon}
                        </Box>
                    )}
                    <Typography variant="h6" component="div">
                        {title}
                    </Typography>
                </Box>

                <Typography
                    variant="h4"
                    color={`${color}.main`}
                    sx={{ mb: 1 }}
                >
                    {value}
                </Typography>

                {subtitle && (
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                        {subtitle}
                    </Typography>
                )}

                {trend && (
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Typography
                            variant="body2"
                            color={trend.isPositive ? 'success.main' : 'error.main'}
                            sx={{ mr: 1 }}
                        >
                            {trend.isPositive ? '+' : ''}{trend.value}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {trend.label}
                        </Typography>
                    </Box>
                )}

                {progress && (
                    <Box sx={{ mt: 1 }}>
                        <LinearProgress
                            variant="determinate"
                            value={progress.value}
                            color={color}
                            sx={{ mb: 0.5 }}
                        />
                        {progress.label && (
                            <Typography variant="caption" color="text.secondary">
                                {progress.label}
                            </Typography>
                        )}
                    </Box>
                )}

                {chip && (
                    <Box sx={{ mt: 1 }}>
                        <Chip
                            label={chip.label}
                            color={chip.color || 'default'}
                            size="small"
                            icon={chip.icon || undefined}
                        />
                    </Box>
                )}
            </CardContent>
        </Card>
    );
};

export default StatsCard;
export type { StatsCardProps };
