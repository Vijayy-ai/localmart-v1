import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

const initialState = {
    isLoading: false,
    error: null,
    notifications: [],
    settings: {
        pushNotifications: true,
        emailNotifications: true,
        darkMode: false,
        locationServices: true,
    }
};

function appReducer(state, action) {
    switch (action.type) {
        case 'SET_LOADING':
            return { ...state, isLoading: action.payload };
        case 'SET_ERROR':
            return { ...state, error: action.payload };
        case 'ADD_NOTIFICATION':
            return {
                ...state,
                notifications: [...state.notifications, action.payload]
            };
        case 'UPDATE_SETTINGS':
            return {
                ...state,
                settings: { ...state.settings, ...action.payload }
            };
        default:
            return state;
    }
}

export function AppProvider({ children }) {
    const [state, dispatch] = useReducer(appReducer, initialState);

    const value = {
        ...state,
        setLoading: (isLoading) => 
            dispatch({ type: 'SET_LOADING', payload: isLoading }),
        setError: (error) => 
            dispatch({ type: 'SET_ERROR', payload: error }),
        addNotification: (notification) => 
            dispatch({ type: 'ADD_NOTIFICATION', payload: notification }),
        updateSettings: (settings) => 
            dispatch({ type: 'UPDATE_SETTINGS', payload: settings }),
    };

    return (
        <AppContext.Provider value={value}>
            {children}
        </AppContext.Provider>
    );
}

export function useApp() {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error('useApp must be used within an AppProvider');
    }
    return context;
} 