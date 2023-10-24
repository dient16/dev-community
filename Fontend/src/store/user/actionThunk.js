import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '~/apiServices';

export const getCurrentUser = createAsyncThunk('user/current-user', async (data, { rejectWithValue }) => {
    const response = await apis.getCurrentUser();
    if (!(response.status === 'success')) return rejectWithValue(response);
    return response.userData;
});
export const login = createAsyncThunk('user/login', async (data, { rejectWithValue }) => {
    const response = await apis.apiLogin(data);
    if (!(response.status === 'success')) return rejectWithValue(response);
    return response;
});
