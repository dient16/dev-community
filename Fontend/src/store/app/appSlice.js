import { createSlice } from '@reduxjs/toolkit';
import * as actions from './actionThunk';
export const appSlice = createSlice({
    name: 'app',
    initialState: {
        isLoading: false,
        isShowModal: false,
        modalChildren: null,
    },
    reducers: {
        showModal: (state, action) => {
            state.isShowModal = action.payload.isShowModal;
            state.modalChildren = action.payload.modalChildren;
        },
        LoadingApp: (state, action) => {
            state.isLoading = action.payload.isLoading;
        },
    },
    extraReducers: (builder) => {},
});
export const { showModal, LoadingApp } = appSlice.actions;
export default appSlice.reducer;
