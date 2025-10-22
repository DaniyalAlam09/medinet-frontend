import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { analyticsAPI } from '../utils/api';
import { toast } from 'react-toastify';

export interface DashboardData {
    stats: any;
    activities: any[];
    [key: string]: any;
}

export const useDashboardData = (role: string) => {
    const [data, setData] = useState<DashboardData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { user } = useAuth();

    useEffect(() => {
        const fetchDashboardData = async () => {
            if (!user) return;

            setLoading(true);
            setError(null);

            try {
                let response;
                
                switch (role) {
                    case 'super_admin':
                        response = await analyticsAPI.getSuperAdminDashboard();
                        break;
                    case 'hospital':
                        response = await analyticsAPI.getHospitalDashboard();
                        break;
                    case 'doctor':
                        response = await analyticsAPI.getDoctorDashboard();
                        break;
                    case 'patient':
                        response = await analyticsAPI.getPatientDashboard();
                        break;
                    default:
                        throw new Error('Invalid user role');
                }

                if (response.data.success) {
                    setData(response.data.data);
                } else {
                    throw new Error(response.data.message || 'Failed to fetch dashboard data');
                }
            } catch (err: any) {
                console.error('Dashboard data fetch error:', err);
                const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard data';
                setError(errorMessage);
                toast.error(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, [role, user]);

    const refetch = async () => {
        if (!user) return;

        setLoading(true);
        setError(null);

        try {
            let response;
            
            switch (role) {
                case 'super_admin':
                    response = await analyticsAPI.getSuperAdminDashboard();
                    break;
                case 'hospital':
                    response = await analyticsAPI.getHospitalDashboard();
                    break;
                case 'doctor':
                    response = await analyticsAPI.getDoctorDashboard();
                    break;
                case 'patient':
                    response = await analyticsAPI.getPatientDashboard();
                    break;
                default:
                    throw new Error('Invalid user role');
            }

            if (response.data.success) {
                setData(response.data.data);
            } else {
                throw new Error(response.data.message || 'Failed to fetch dashboard data');
            }
        } catch (err: any) {
            console.error('Dashboard data refetch error:', err);
            const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch dashboard data';
            setError(errorMessage);
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return {
        data,
        loading,
        error,
        refetch
    };
};

export default useDashboardData;
