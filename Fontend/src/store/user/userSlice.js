import { createSlice } from '@reduxjs/toolkit';
import * as actions from './actionThunk';
export const userSlice = createSlice({
    name: 'user',
    initialState: {
        isLoggedIn: false,
        currentUser: null,
        token: null,
        isLoading: false,
        message: null,
    },
    reducers: {
        logout: (state, action) => {
            state.isLoggedIn = false;
            state.token = null;
            state.currentUser = null;
            state.isLoading = null;
            state.message = null;
        },
        clearMessage: (state, action) => {
            state.message = null;
        },
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getCurrentUser.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getCurrentUser.fulfilled, (state, action) => {
            state.isLoading = false;
            state.currentUser = action.payload;
            state.isLoggedIn = true;
        });
        builder.addCase(actions.getCurrentUser.rejected, (state, action) => {
            state.isLoading = false;
            state.currentUser = null;
            state.token = null;
            state.message = action.payload.message || 'Error from server';
        });
        /////Login
        builder.addCase(actions.login.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.login.fulfilled, (state, action) => {
            state.isLoading = false;
            state.isLoggedIn = true;
            state.token = action.payload.accessToken;
            state.currentUser = action.payload.userData;
        });
        builder.addCase(actions.login.rejected, (state, action) => {
            state.isLoading = false;
            state.currentUser = null;
            state.token = null;
            state.message = action.payload.message || 'Error from server';
        });
    },
});
export const { login, logout, clearMessage } = userSlice.actions;
export default userSlice.reducer;
