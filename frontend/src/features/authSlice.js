import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('auth'))?.user || null : null,
    token: typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('auth'))?.token || null : null,
    isLoading: false,
    error: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setCredentials: (state, action) => {
            const { user, token } = action.payload;
            state.user = { ...state.user, ...user };
            state.token = token || state.token;
            if (typeof window !== 'undefined') {
                const existingAuth = JSON.parse(sessionStorage.getItem('auth')) || {};
                sessionStorage.setItem('auth', JSON.stringify({
                    user: { ...existingAuth.user, ...user },
                    token: token || existingAuth.token,
                }));
            }
        },
        clearCredentials: (state) => {
            state.user = null;
            state.token = null;
            if (typeof window !== 'undefined') {
                sessionStorage.removeItem('auth');
            }
        },
        setLoading: (state, action) => {
            state.isLoading = action.payload;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
    },
});

export const { setCredentials, clearCredentials, setLoading, setError } = authSlice.actions;

export default authSlice.reducer;

// Selectors
export const selectCurrentUser = (state) => state.auth.user;
export const selectCurrentToken = (state) => state.auth.token;
