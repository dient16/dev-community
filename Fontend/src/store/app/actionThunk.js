import { createAsyncThunk } from '@reduxjs/toolkit';

export const getPost = createAsyncThunk('app/posts', async (data, { rejectWithValue }) => {
    //  const response = await apis.apiGetCategories();
    //  console.log(response);
    //  if (!response.success) return rejectWithValue(response);
    //  return response.prodCategories;
});
