import {configureStore} from "@reduxjs/toolkit";
import loggedInUserSlice from "./loggedInUserSlice.js";
import newUserSlice from "./newUserSlice.js";
import {loadData} from './newUserSlice.js'
import {getLoggedUser} from "./loggedInUserSlice.js";
import postsSlice from "./postsSlice.js";
import usersSlice from "./usersSlice.js";
import connectionsSlice from "./connectionsSlice.js";
import loggedUserDataSlice from "./loggedUserDataSlice.js";

const preloadedState = {
    user: loadData(),
    loggedUser: getLoggedUser()
}

const reduxStore = configureStore({
    reducer: {user: newUserSlice, loggedUser: loggedInUserSlice, posts: postsSlice, users: usersSlice,
        connections: connectionsSlice, loggedUserData: loggedUserDataSlice},
    preloadedState
})

export default reduxStore;