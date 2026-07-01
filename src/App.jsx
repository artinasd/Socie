import {RouterProvider} from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import RootLayout from "../Components/Permenant Components/RootLayout.jsx";
import MainFeedContainer from "../Components/Permenant Components/MainFeedContainer.jsx";
import SidebarRContainer from "../Components/Permenant Components/Sidebars/Right/SidebarRContainer.jsx";
import SuggestedUsersView from "../Components/SuggestedUsersView.jsx";
import Profile from "../Components/AccountProfile/Profile.jsx";
import SingUpFlow from "../Components/Authentication/SingUp Flow.jsx";
import {useSelector, useDispatch} from "react-redux";
import LogInForm from "../Components/Authentication/LogInForm.jsx";
import {useEffect} from "react";
import { api } from "../Data/api.js";
import {postsSliceActions} from "../Data/postsSlice.js";
import {usersSliceActions} from "../Data/usersSlice.js";
import {connectionsSliceActions} from "../Data/connectionsSlice.js";
import {loggedUserDataSliceActions} from "../Data/loggedUserDataSlice.js";

function AppLayout() {
    const loggedUserUsername = useSelector(state => state.loggedUser)
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchAllUsers() {
            let { data: users, error } = await api.get('/users');

            if (!error && users) {
                dispatch(usersSliceActions.setUsers(users))
                if (loggedUserUsername) {
                    const loggedInUser = users.find(user => user.username === loggedUserUsername);
                    if (loggedInUser) {
                        dispatch(loggedUserDataSliceActions.setLoggedUserData(loggedInUser))
                    }
                }
            } else {
                dispatch(usersSliceActions.setUsers([]))
            }
        }
        fetchAllUsers()
    }, [loggedUserUsername, dispatch]);

    useEffect(() => {
        async function fetchConnections() {
            let { data: connections, error } = await api.get('/connections');
            if (!error && connections) {
                dispatch(connectionsSliceActions.setConnections(connections))
            } else {
                dispatch(connectionsSliceActions.setConnections([]))
            }
        }
        fetchConnections()
    }, [dispatch]);

    useEffect(() => {
        async function fetchAllPosts() {
            let { data: posts, error: postError } = await api.get('/posts');
            let { data: users, error: userError } = await api.get('/users');

            if (postError || userError) {
                console.warn("Error fetching posts or users")
                dispatch(postsSliceActions.setPosts([]))
            } else {
                const postAndUser = posts.map(post => (
                    {...post, user: users.find(user => user.id === post.posterId)})
                )
                dispatch(postsSliceActions.setPosts(postAndUser))
            }
        }
        fetchAllPosts()
    }, [dispatch, loggedUserUsername]);

    const router = createBrowserRouter([
        {
            path: "/",
            element: <RootLayout />,
            children: [
                {path: '/', element:
                        <>
                            <MainFeedContainer />
                            <SidebarRContainer />
                        </>},

                {path: '/suggestions', element: <SuggestedUsersView />},
                {path: '/:username/profile', element: <Profile />}
            ]
        },
        {path: '/sign-up', element: <SingUpFlow />},
        {path: '/log-in', element: <LogInForm/>}
    ])
    return (
        <RouterProvider router={router} />
    )
}

export default AppLayout