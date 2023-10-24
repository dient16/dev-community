import { createAsyncThunk } from '@reduxjs/toolkit';
import * as apis from '~/apiServices';
export const getPosts = createAsyncThunk('post/get-posts', async (data, { rejectWithValue }) => {
    const response = await apis.apiGetPosts();
    if (!(response.status === 'success')) return rejectWithValue(response.message);
    return response;
});

export const uploadImage = createAsyncThunk('post/upload-image', async (data, { rejectWithValue }) => {
    const response = await apis.apiUploadImage(data);
    if (!(response.status === 'success')) return rejectWithValue(response.message);
    return response.imageUrl;
});
