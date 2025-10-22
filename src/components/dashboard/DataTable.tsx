import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    IconButton,
    Avatar,
    Box,
    Typography,
    Skeleton,
} from '@mui/material';
import { SxProps, Theme } from '@mui/material/styles';

export interface TableColumn {
    id: string;
    label: string;
    minWidth?: number;
    align?: 'right' | 'left' | 'center';
    format?: (value: any, row: any) => React.ReactNode;
    sortable?: boolean;
}

export interface TableAction {
    icon: React.ReactNode;
    onClick: (row: any) => void;
    color?: 'primary' | 'secondary' | 'error' | 'warning' | 'info' | 'success';
    tooltip?: string;
}

interface DataTableProps {
    columns: TableColumn[];
    data: any[];
    actions?: TableAction[];
    loading?: boolean;
    emptyMessage?: string;
    sx?: SxProps<Theme>;
    stickyHeader?: boolean;
    maxHeight?: number;
}

const DataTable: React.FC<DataTableProps> = ({
    columns,
    data,
    actions = [],
    loading = false,
    emptyMessage = 'No data available',
    sx = {},
    stickyHeader = false,
    maxHeight
}) => {
    const renderCellContent = (column: TableColumn, row: any) => {
        const value = row[column.id];

        if (column.format) {
            return column.format(value, row);
        }

        return value;
    };

    const renderSkeletonRow = () => (
        <TableRow>
            {columns.map((column) => (
                <TableCell key={column.id}>
                    <Skeleton variant="text" width="80%" />
                </TableCell>
            ))}
            {actions.length > 0 && (
                <TableCell>
                    <Skeleton variant="circular" width={32} height={32} />
                </TableCell>
            )}
        </TableRow>
    );

    return (
        <TableContainer
            component={Paper}
            sx={{
                maxHeight: maxHeight || 400,
                ...sx
            }}
        >
            <Table stickyHeader={stickyHeader}>
                <TableHead>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell
                                key={column.id}
                                align={column.align || 'left'}
                                style={{ minWidth: column.minWidth }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                        {actions.length > 0 && (
                            <TableCell align="center" style={{ minWidth: actions.length * 40 }}>
                                Actions
                            </TableCell>
                        )}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {loading ? (
                        Array.from({ length: 5 }).map((_, index) => (
                            <React.Fragment key={index}>
                                {renderSkeletonRow()}
                            </React.Fragment>
                        ))
                    ) : data.length === 0 ? (
                        <TableRow>
                            <TableCell
                                colSpan={columns.length + (actions.length > 0 ? 1 : 0)}
                                align="center"
                                sx={{ py: 4 }}
                            >
                                <Typography variant="body2" color="text.secondary">
                                    {emptyMessage}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, index) => (
                            <TableRow key={row.id || index} hover>
                                {columns.map((column) => (
                                    <TableCell
                                        key={column.id}
                                        align={column.align || 'left'}
                                    >
                                        {renderCellContent(column, row)}
                                    </TableCell>
                                ))}
                                {actions.length > 0 && (
                                    <TableCell align="center">
                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                            {actions.map((action, actionIndex) => (
                                                <IconButton
                                                    key={actionIndex}
                                                    size="small"
                                                    color={action.color || 'primary'}
                                                    onClick={() => action.onClick(row)}
                                                    title={action.tooltip}
                                                >
                                                    {action.icon}
                                                </IconButton>
                                            ))}
                                        </Box>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// Helper functions for common column formatters
export const formatStatus = (value: string, colorMap?: Record<string, 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning'>) => (
    <Chip
        label={value}
        color={colorMap?.[value] || 'default'}
        size="small"
    />
);

export const formatAvatar = (name: string, src?: string) => (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
            {src ? (
                <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                name.split(' ').map(n => n[0]).join('')
            )}
        </Avatar>
        <Typography variant="subtitle2">
            {name}
        </Typography>
    </Box>
);

export const formatDate = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleDateString();
};

export const formatDateTime = (date: string | Date) => {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj.toLocaleString();
};

export const formatCurrency = (amount: number, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(amount);
};

export default DataTable;
export type { DataTableProps, TableColumn, TableAction };
