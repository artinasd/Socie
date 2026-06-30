import {createSlice} from "@reduxjs/toolkit";

const connectionsSlice = createSlice({
    name: "connections",
    initialState: null,
    reducers: {
        setConnections: (_, action) => {
            return action.payload;
        }
    }
})

export default connectionsSlice.reducer;
export const connectionsSliceActions = connectionsSlice.actions