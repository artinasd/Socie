import {createSlice} from "@reduxjs/toolkit";

const loggedUserDataSlice = createSlice({
    name: "loggedUserData",
    initialState: null,
    reducers: {
        setLoggedUserData: (state, action) => {
            state = action.payload;
            return state;
        },
        updateBio: (state, action) => {
            if (state) {
                state.bio = action.payload;
            }
            return state;
        },
        updateProfile: (state, action) => {
            if (state) {
                const { bio, birthday, location, header_pic, favorites } = action.payload;
                if (bio !== undefined) state.bio = bio;
                if (birthday !== undefined) state.birthday = birthday;
                if (location !== undefined) state.location = location;
                if (header_pic !== undefined) state.header_pic = header_pic;
                if (favorites !== undefined) state.favorites = favorites;
            }
            return state;
        }
    }
})

export default loggedUserDataSlice.reducer;
export const loggedUserDataSliceActions = loggedUserDataSlice.actions