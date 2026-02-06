import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../lib/axios';
import socketService from '../lib/socket';
import { User } from '../types';
import toast from 'react-hot-toast';

interface AuthContextType {
    user: User | any;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (data: any) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        //check if user is logged in
        const token = localStorage.getItem('token');
        const savedUser = localStorage.getItem('user');
        
        if(token && savedUser){
            setUser(JSON.parse(savedUser));
            socketService.connect();
        }     

        setLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        try{
            const response = await api.post('/auth/login',{email, password});
            const { user, token, refreshToken } = response.data.data;

            localStorage.setItem('token',token);
            localStorage.setItem('refreshToken',refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            socketService.connect();

            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error: any){
            toast.error(error.response?.data?.message || 'Login Failed');
            throw error;
        }
    };

    const register = async (data: any) => {
        try {
            const response = await api.post('/auth/register', data);
            const { user, token, refreshToken } = response.data.data;

            localStorage.setItem('token',token);
            localStorage.setItem('refreshToken',refreshToken);
            localStorage.setItem('user', JSON.stringify(user));

            setUser(user);
            socketService.connect();

            toast.success('Registration successful!');
            navigate('/dashboard');
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Registration Failed');
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');

        setUser(null);
        socketService.disconnect();

        toast.success('Logged out successfully');
        navigate('/login');
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    }
    
    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};