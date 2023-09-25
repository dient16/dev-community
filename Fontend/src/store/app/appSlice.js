import { createSlice } from '@reduxjs/toolkit';
import * as actions from './actionThunk';
export const appSlice = createSlice({
    name: 'app',
    initialState: {
        posts: null,
        isLoading: false,
    },
    reducers: {
        //   logout: (state) => {
        //        state.isLoading = true;
        //   }
    },
    extraReducers: (builder) => {
        builder.addCase(actions.getPost.pending, (state) => {
            state.isLoading = true;
        });
        builder.addCase(actions.getPost.fulfilled, (state, action) => {
            state.isLoading = false;
            state.posts = action.payload;
        });
        builder.addCase(actions.getPost.rejected, (state, action) => {
            state.isLoading = false;
            state.errorMessage = action.payload.message;
        });
    },
});
//export const {} = appSlice.actions;
export default appSlice.reducer;
