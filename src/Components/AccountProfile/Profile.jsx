import Header from "./Header.jsx";
import placeholder from '../../assets/headerPlaceholder.jpg';
import About from "./About.jsx";
import PostCard from "../PostCards.jsx";
import Connections from "./Connections.jsx";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import loadingGIF from "../../assets/loading.gif"

function Profile() {
    const { username } = useParams();

    const users = useSelector(state => state.users)
    const viewer = useSelector(state => state.loggedUserData)
    const posts = useSelector(state => state.posts)
    const allConnections = useSelector(state => state.connections)

    if (users === null || allConnections === null || posts === null) {
        return <div className='col-span-3 mx-auto my-64'><img className='w-12 opacity-50' src={loadingGIF} alt="Loading..." /></div>;
    }

    const selectedUser = users.find(user => user.username === username)

    if (!selectedUser) {
        return <div className='col-span-3 mx-auto my-32 text-center text-2xl text-gray-500'>User not found</div>;
    }

    const userId = selectedUser.id
    const userPosts = posts.filter(post => post.posterId === userId)

    const followingIds = allConnections.filter(connection => connection.followerId === selectedUser.id).map(connection => connection.followingId)
    const followerIds = allConnections.filter(connection => connection.followingId === selectedUser.id).map(connection => connection.followerId)
    const userFollowings = users.filter(user => followingIds.includes(user.id))
    const userFollowers = users.filter(user => followerIds.includes(user.id))

    // Privacy logic
    const isOwner = viewer && viewer.id === selectedUser.id
    const viewerFollowsSelected = viewer && allConnections.some(c => c.followerId === viewer.id && c.followingId === selectedUser.id)
    const canSeePosts = !selectedUser.private || isOwner || viewerFollowsSelected

    return (
        <div className='col-span-3 mt-12 mr-6 mb-10'>
            <Header
                name={selectedUser.name}
                profile={selectedUser.pic}
                header={placeholder}
                username={selectedUser.username}
                follower={userFollowers ? userFollowers.length : 0}
                following={userFollowings ? userFollowings.length : 0}
            />

            <div className='grid grid-cols-4 gap-6 mt-6'>
                <About />

                <div className='col-span-2'>
                    {!canSeePosts ? (
                        <div className="bg-white p-8 rounded-xl shadow-sm text-center border border-gray-100">
                            <h3 className="text-lg font-bold mb-2">This account is private</h3>
                            <p className='text-gray-500'>Follow to see their posts and stories.</p>
                        </div>
                    ) : (userPosts.length === 0) ? (
                        <div className="bg-white p-12 rounded-xl shadow-sm text-center border border-gray-100">
                            <div className="w-16 h-16 border-2 border-black rounded-full flex items-center justify-center mx-auto mb-4 opacity-20">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                            </div>
                            <p className='text-xl font-medium text-gray-800'>No posts yet</p>
                        </div>
                    ) : (
                        <ul className="flex flex-col gap-6">
                            {userPosts.slice().reverse().map((eachPost, index) => (
                                <li key={index}>
                                    <PostCard
                                        name={selectedUser.name}
                                        description={eachPost.description}
                                        profile={selectedUser.pic}
                                        image={eachPost.media}
                                        username={selectedUser.username}
                                        postId={eachPost.id}
                                        style='w-full'
                                    />
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                <div className='col-span-1 space-y-6'>
                    <Connections componentTitle='Following' usersToMap={userFollowings ? userFollowings : []} />
                    <Connections componentTitle='Followers' usersToMap={userFollowers ? userFollowers : []} />
                </div>
            </div>
        </div>
    );
}

export default Profile;