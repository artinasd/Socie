import {createSlice} from "@reduxjs/toolkit";

function saveData(username) {
    localStorage.setItem("socie_session", JSON.stringify(username))
}

function getLoggedUser() {
    const readFile = localStorage.getItem("socie_session")
    if (readFile) {
        return JSON.parse(readFile);
    }
    return ''
}

const loggedInUserSlice = createSlice({
    name: "loggedInUser",
    initialState: '',
    reducers: {
        setLoggedUser: (_, action) => {
            saveData(action.payload)
            return action.payload
        }
    }
})

export default loggedInUserSlice.reducer
export const loggedUserActions = loggedInUserSlice.actions
export {getLoggedUser}