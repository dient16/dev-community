import { createSlice } from '@reduxjs/toolkit';

export const authSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        currentUser: null,
        token: null,
    },
    reducers: {
        login: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn;
            state.token = action.payload.token;
        },
        logout: (state, action) => {
            state.isLoggedIn = false;
            state.token = null;
            state.currentUser = null;
            state.isLoading = null;
            state.message = null;
        },
    },
});
export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
