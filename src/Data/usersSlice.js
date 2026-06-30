import {createSlice} from "@reduxjs/toolkit";

const usersSlice = createSlice({
    name: "users",
    initialState: null,
    reducers: {
        setUsers: (_, action) => {
            return action.payload;
        }
    }
})

export default usersSlice.reducer;
export const usersSliceActions = usersSlice.actions