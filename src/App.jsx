import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { api } from "./Data/api.js";
import { usersSliceActions } from "./Data/usersSlice.js";
import { postsSliceActions } from "./Data/postsSlice.js";
import { connectionsSliceActions } from "./Data/connectionsSlice.js";
import { loggedUserDataSliceActions } from "./Data/loggedUserDataSlice.js";

import RootLayout from "./Components/Permenant Components/RootLayout.jsx";
import MainFeedContainer from "./Components/Permenant Components/MainFeedContainer.jsx";
import SuggestedUsersView from "./Components/SuggestedUsersView.jsx";
import Profile from "./Components/AccountProfile/Profile.jsx";
import SingUpFlow from "./Components/Authentication/SingUp Flow.jsx";
import CompleteSignup from "./Components/Authentication/CompleteSignup.jsx";

const router = createBrowserRouter([
    {
        path: "/",
        element: <RootLayout />,
        children: [
            { path: "/", element: <MainFeedContainer /> },
            { path: "/suggestions", element: <SuggestedUsersView /> },
            { path: "/:username/profile", element: <Profile /> },
        ]
    },
    { path: "/sign-up", element: <SingUpFlow /> },
    { path: "/complete-signup", element: <CompleteSignup /> }
]);

function App() {
    const dispatch = useDispatch();
    const loggedUserUsername = useSelector(state => state.loggedUser);

    useEffect(() => {
        async function fetchInitialData() {
            try {
                // Fetch Users
                const { data: users } = await api.get('/users');
                if (users) dispatch(usersSliceActions.setUsers(users));

                // Fetch Posts
                const { data: posts } = await api.get('/posts');
                if (posts && users) {
                    const enrichedPosts = posts.map(post => ({
                        ...post,
                        user: users.find(u => u.id === post.posterId)
                    })).reverse();
                    dispatch(postsSliceActions.setPosts(enrichedPosts));
                }

                // Fetch Connections
                const { data: connections } = await api.get('/connections');
                if (connections) dispatch(connectionsSliceActions.setConnections(connections));

                // Set Logged User Data Object
                if (loggedUserUsername && users) {
                    const currentUser = users.find(u => u.username === loggedUserUsername);
                    if (currentUser) {
                        dispatch(loggedUserDataSliceActions.setLoggedUserData(currentUser));
                    }
                }
            } catch (error) {
                console.error("Failed to fetch initial data:", error);
            }
        }

        fetchInitialData();
    }, [dispatch, loggedUserUsername]);

    return <RouterProvider router={router} />;
}

export default App;