import Header from "./Header.jsx";
import About from "./About.jsx";
import PostCards from "../PostCards.jsx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import loadingGif from "../../assets/loading.gif";

function Profile() {
    const { username } = useParams();
    const [targetUser, setTargetUser] = useState(null);
    const [userPosts, setUserPosts] = useState([]);

    const allUsers = useSelector(state => state.users);
    const allPosts = useSelector(state => state.posts);
    const loggedUser = useSelector(state => state.loggedUserData);

    useEffect(() => {
        window.scrollTo(0, 0);
        if (allUsers) {
            const foundUser = allUsers.find(u => u.username === username);
            setTargetUser(foundUser || null);

            if (foundUser && allPosts) {
                // Filter posts that belong to this specific profile
                const postsForUser = allPosts.filter(post => post.posterId === foundUser.id);
                setUserPosts(postsForUser);
            }
        }
    }, [username, allUsers, allPosts]);

    if (!allUsers) {
        return (
            <div className="flex justify-center items-center h-screen">
                <img src={loadingGif} className="w-12 opacity-50" alt="Loading..." />
            </div>
        );
    }

    if (!targetUser) {
        return (
            <div className="text-center mt-20 text-gray-500 text-xl font-bold">
                User not found.
            </div>
        );
    }

    // Determine if the profile should be blocked due to privacy
    const isOwner = loggedUser?.id === targetUser.id;
    const isPrivate = targetUser.private;
    // Assuming you handle connections logic here or pass it to `Header` component:
    // (If the profile is private and loggedUser doesn't follow targetUser, hide posts)

    return (
        <div className="max-w-[900px] mx-auto pb-10">
            <Header targetUser={targetUser} isOwner={isOwner} />

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6 px-4 md:px-0">
                <div className="md:col-span-1">
                    <About targetUser={targetUser} />
                </div>

                <div className="md:col-span-2 space-y-6">
                    {userPosts.length > 0 ? (
                        userPosts.map(post => (
                            <PostCards
                                key={post.id}
                                id={post.id}
                                userPic={targetUser.pic}
                                name={targetUser.name}
                                username={targetUser.username}
                                content={post.description}
                                image={post.media}
                            />
                        ))
                    ) : (
                        <div className="bg-white rounded-xl shadow-sm p-10 text-center text-gray-400">
                            {isOwner ? "You haven't posted anything yet." : "No posts available."}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Profile;