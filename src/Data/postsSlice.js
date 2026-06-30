import {createSlice} from "@reduxjs/toolkit";

const postsSlice = createSlice({
    name: "posts",
    initialState: null,
    reducers: {
        setPosts: (_, action) => {
            return action.payload;
        }
    }
})

export default postsSlice.reducer;
export const postsSliceActions = postsSlice.actions;