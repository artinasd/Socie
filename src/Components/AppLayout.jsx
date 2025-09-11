import {RouterProvider} from "react-router-dom";
import {createBrowserRouter} from "react-router-dom";
import RootLayout from "../Components/Permenant Components/RootLayout.jsx";
import MainFeedContainer from "../Components/Permenant Components/MainFeedContainer.jsx";
import SidebarRContainer from "../Components/Permenant Components/Sidebars/Right/SidebarRContainer.jsx";
import SuggestedUsersView from "../Components/SuggestedUsersView.jsx";
import Profile from "../Components/AccountProfile/Profile.jsx";
import SingUpFlow from "../Components/Authentication/SingUp Flow.jsx";
import {useSelector} from "react-redux";
import LogInForm from "../Components/Authentication/LogInForm.jsx";
import {useEffect, useState} from "react";
import supabase from "../Data/supabase.js";
import {useDispatch} from "react-redux";
import {postsSliceActions} from "../Data/postsSlice.js";
import {usersSliceActions} from "../Data/usersSlice.js";
import {connectionsSliceActions} from "../Data/connectionsSlice.js";
import {loggedUserDataSliceActions} from "../Data/loggedUserDataSlice.js";

function AppLayout() {
    const loggedUserUsername = useSelector(state => state.loggedUser)
    const [allUsers, setAllUsers] = useState(null)
    const [loggedUserId, setLoggedUserId] = useState(null)
    const [loggedUserFollowings, setLoggedUserFollowings] = useState(null)
    const [allPosts, setAllPosts] = useState(null)
    const [loggedUser, setLoggedUser] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        async function fetchAllUsers() {
            let { data: users, error } = await supabase
                .from('users')
                .select('*')

            setAllUsers(users.filter(each => each.username !== loggedUserUsername))
            dispatch(usersSliceActions.setUsers(users))

            if (loggedUserUsername) {
                setLoggedUser(users.find(user => user.username === loggedUserUsername))
                dispatch(loggedUserDataSliceActions.setLoggedUserData(users.find(user => user.username === loggedUserUsername)))
            }
        }

        fetchAllUsers()
    }, [loggedUserUsername]);

    useEffect(() => {
        if (loggedUser) {
            setLoggedUserId(loggedUser.id)
        }
    }, [loggedUser]);

    useEffect(() => {
        async function fetchConnections() {
            let { data: connections, error } = await supabase
                .from('connections')
                .select('*')

            dispatch(connectionsSliceActions.setConnections(connections))
        }
        fetchConnections()
    }, []);

    useEffect(() => {
        async function fetchAllPosts() {
            let { data: posts, postError } = await supabase
                .from('posts')
                .select('*')

            let { data: users, userError } = await supabase
                .from('users')
                .select('*')

            if (postError || userError) {
                console.warn("Error")
            } else {
                const postAndUser = posts.map(post => (
                    {...post, user: users.find(user => user.id === post.posterId)})
                )

                dispatch(postsSliceActions.setPosts(postAndUser))
            }
        }

        fetchAllPosts()
    }, [loggedUser]);

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