import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import api from '../config/api';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load token and user from storage on app start
    useEffect(() => {
        loadStoredAuth();
    }, []);

    const loadStoredAuth = async () => {
        try {
            const storedToken = await AsyncStorage.getItem('token');
            const storedUser = await AsyncStorage.getItem('user');

            if (storedToken && storedUser) {
                setToken(storedToken);
                setUser(JSON.parse(storedUser));
                // Set token in API headers
                api.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
            }
        } catch (error) {
            console.error('Error loading auth:', error);
        } finally {
            setLoading(false);
        }
    };

    const login = async (email, password) => {
        try {
            const response = await api.post('/auth/login', { email, password });
            const { token: newToken, user: newUser } = response.data;

            // Store in state
            setToken(newToken);
            setUser(newUser);

            // Store in AsyncStorage
            await AsyncStorage.setItem('token', newToken);
            await AsyncStorage.setItem('user', JSON.stringify(newUser));

            // Set token in API headers
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            };
        }
    };

    const signup = async (name, email, password, role) => {
        try {
            const response = await api.post('/auth/signup', { name, email, password, role });
            const { token: newToken, user: newUser } = response.data;

            // Store in state
            setToken(newToken);
            setUser(newUser);

            // Store in AsyncStorage
            await AsyncStorage.setItem('token', newToken);
            await AsyncStorage.setItem('user', JSON.stringify(newUser));

            // Set token in API headers
            api.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Signup failed'
            };
        }
    };

    const logout = async () => {
        try {
            // Clear state
            setToken(null);
            setUser(null);

            // Clear AsyncStorage
            await AsyncStorage.removeItem('token');
            await AsyncStorage.removeItem('user');

            // Remove token from API headers
            delete api.defaults.headers.common['Authorization'];
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };

    const value = {
        user,
        token,
        loading,
        login,
        signup,
        logout,
        isAuthenticated: !!token,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
