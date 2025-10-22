import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { toast } from 'react-toastify';
import { User, LoginCredentials, RegisterData, AuthContextType, AuthResponse } from '../types/auth';
import { authAPI } from '../utils/api';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Check if user is logged in on app start
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (token) {
                    const response = await authAPI.getCurrentUser();
                    setUser(response.data.user);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                localStorage.removeItem('token');
                localStorage.removeItem('user');
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, []);

    const login = async (credentials: LoginCredentials, event?: React.BaseSyntheticEvent) => {
        if (event) {
            event.preventDefault();
        }

        try {
            setIsLoading(true);
            setError(null);

            const response = await authAPI.login(credentials);
            const data: AuthResponse = response.data;

            if (data.success && data.token && data.user) {
                // Store token and user data
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data.user));
                setUser(data.user);
                toast.success('Login successful!');
            } else {
                throw new Error(data.message || 'Login failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Login failed';
            setError(errorMessage);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (data: RegisterData) => {
        try {
            setIsLoading(true);
            setError(null);

            const response = await authAPI.register(data);
            const responseData: AuthResponse = response.data;

            if (responseData.success && responseData.token && responseData.user) {
                // Store token and user data
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('user', JSON.stringify(responseData.user));
                setUser(responseData.user);
                toast.success('Registration successful! Please check your email for verification.');
            } else {
                throw new Error(responseData.message || 'Registration failed');
            }
        } catch (error: any) {
            const errorMessage = error.response?.data?.message || error.message || 'Registration failed';
            setError(errorMessage);
            toast.error(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        try {
            // Call logout API
            authAPI.logout();
        } catch (error) {
            console.error('Logout API call failed:', error);
        } finally {
            // Clear local storage and state
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            setError(null);
        }
    };

    const isAuthenticated = !!user;

    // Check if user needs approval
    const needsApproval = () => {
        if (!user) return false;

        if (user.role === 'super_admin' || user.role === 'patient') {
            return false;
        }

        if (user.role === 'hospital' && user.approvalStatus !== 'approved') {
            return true; // Always needs hospital approval
        }

        if (user.role === 'doctor') {
            return user.approvalStatus !== 'approved';
        }

        return false;
    };

    const value: AuthContextType = {
        user,
        login,
        register,
        logout,
        isAuthenticated,
        isLoading,
        error,
        needsApproval,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
