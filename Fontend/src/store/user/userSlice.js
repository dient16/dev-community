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
            state.message = 'Login status has expired, Please login again!';
        });
    },
});
export const { login, logout, clearMessage, message } = userSlice.actions;
export default userSlice.reducer;
