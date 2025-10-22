import React from 'react';
import { Grid, GridProps } from '@mui/material';
import StatsCard from './StatsCard';
import type { StatsCardProps } from './StatsCard';

interface StatsGridProps {
    stats: StatsCardProps[];
    loading?: boolean;
    columns?: {
        xs?: number;
        sm?: number;
        md?: number;
        lg?: number;
    };
    spacing?: number;
    sx?: GridProps['sx'];
}

const StatsGrid: React.FC<StatsGridProps> = ({
    stats,
    columns = { xs: 12, sm: 6, md: 3 },
    spacing = 3,
    sx = {}
}) => {
    return (
        <Grid container spacing={spacing} sx={sx}>
            {stats.map((stat, index) => (
                <Grid
                    key={index}
                    item
                    xs={columns.xs}
                    sm={columns.sm}
                    md={columns.md}
                    lg={columns.lg}
                >
                    <StatsCard
                        {...stat}
                    // Override loading state for individual cards
                    // This allows for skeleton loading if needed
                    />
                </Grid>
            ))}
        </Grid>
    );
};

export default StatsGrid;
export type { StatsGridProps };
