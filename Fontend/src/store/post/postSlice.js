import { createSlice } from '@reduxjs/toolkit';
import * as actions from './actionThunk';
export const postSlice = createSlice({
    name: 'post',
    initialState: {
        imageUrl: null,
        posts: null,
        isLoading: false,
        message: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(actions.uploadImage.pending, (state) => {
            state.imageUrl = '';
            state.isLoading = true;
        });
        builder.addCase(actions.uploadImage.fulfilled, (state, action) => {
            state.isLoading = false;
            state.imageUrl = action.payload;
        });
        builder.addCase(actions.uploadImage.rejected, (state, action) => {
            state.isLoading = false;
            state.message = action.payload;
        });
        ////////////get posts
        builder.addCase(actions.getPosts.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getPosts.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
        });
        builder.addCase(actions.getPosts.rejected, (state, action) => {
            state.isLoading = false;
            state.message = action.payload;
        });
    },
});
export const {} = postSlice.actions;
export default postSlice.reducer;
