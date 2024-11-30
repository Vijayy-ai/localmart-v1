import React from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingScreen from '../components/LoadingScreen';
import { useApp } from '../context/AppContext';

export function NavigationGuard({ children }) {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const { isLoading, error } = useApp();

    if (authLoading || isLoading) {
        return <LoadingScreen />;
    }

    if (error) {
        return (
            <ErrorView 
                message={error} 
                onRetry={() => window.location.reload()} 
            />
        );
    }

    return children;
} 