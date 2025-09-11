import {createSlice} from "@reduxjs/toolkit";

function saveData(state) {
    localStorage.setItem('SAVED_DATA', JSON.stringify(state));
}

export function loadData() {
    const rawFoundData = localStorage.getItem('SAVED_DATA');
    if (rawFoundData) {
        return JSON.parse(rawFoundData); // No explicit cast needed in JavaScript
    }
    return []; // Return an empty array if no data is found
}

const initialState = []; // No type annotation in JavaScript

const newUserSlice = createSlice({
    name: "user",
    initialState: initialState,
    reducers: {
        addUser: (state, action) => {
            state.push(action.payload);
            saveData(state);
        },

        addPost: (state, action) => {
            const {username, post} = action.payload;
            const user = state.find(eachUser => eachUser.username === username);
            if (user) {
                if (!user.posts) {
                    user.posts = {feed: [], stories: []};
                }
                if (!user.posts.feed) {
                    user.posts.feed = [];
                }
                user.posts.feed.push(post);
                saveData(state);
            }
        },

        addConnection: (state, action) => {
            const {loggedUser, username} = action.payload;
            const operatorUser = state.find(users => users.username === loggedUser);
            const followedUser = state.find(users => users.username === username)
            if (!operatorUser.connections) {
                operatorUser.connections = {followings: [], followers: []}
            }
            operatorUser.connections.followings.push(username);
            followedUser.connections.followers.push(loggedUser)
            saveData(state)
        }
    }
});

export default newUserSlice.reducer;
export const newUserActions = newUserSlice.actions;
