import Header from "./Header.jsx";
import placeholder from '../../assets/headerPlaceholder.jpg';
import About from "./About.jsx";
import PostCard from "../PostCards.jsx";
import Connections from "./Connections.jsx";
import { useParams } from "react-router-dom";
import supabase from "../../Data/supabase.js";
import { useState, useEffect } from "react";
import loadingGIF from "../../assets/loading.gif"
import connections from "./Connections.jsx";
import {useSelector} from "react-redux";

function Profile() {
    const { username } = useParams();

    const users = useSelector(state => state.users)
    const viewer = useSelector(state => state.loggedUserData)
    const selectedUser = users.find(user => user.username === username)
    const posts = useSelector(state => state.posts)
    const allConnections = useSelector(state => state.connections)

    if (users.length === 0) {
        return <div className='col-span-3 mx-auto my-64'><img className='w-12 opacity-50' src={loadingGIF} /></div>;
    }
    const userId = selectedUser.id
    const userPosts = posts.filter(post => post.posterId === userId)

    if (allConnections.length === 0) {
        return <div className='col-span-3 mx-auto my-64'><img className='w-12 opacity-50' src={loadingGIF} /></div>;
    }
    const followingIds = allConnections.filter(connection => connection.followerId === selectedUser.id).map(connection => connection.followingId)
    const followerIds = allConnections.filter(connection => connection.followingId === selectedUser.id).map(connection => connection.followerId)
    const userFollowings = users.filter(user => followingIds.includes(user.id))
    const userFollowers = users.filter(user => followerIds.includes(user.id))

    // Privacy: only owner or followers can see posts if profile is private
    const isOwner = viewer && viewer.id === selectedUser.id
    const viewerFollowsSelected = viewer && allConnections.some(c => c.followerId === viewer.id && c.followingId === selectedUser.id)
    const canSeePosts = !selectedUser.private || isOwner || viewerFollowsSelected

    return (
        <div className='col-span-3 mt-12 mr-6 mb-3'>
            <Header
                name={selectedUser.name}
                profile={selectedUser.pic}
                header={placeholder}
                username={selectedUser.username}
                follower={userFollowers ? userFollowers.length : 0}
                following={userFollowings ? userFollowings.length : 0}
            />

            <div className='grid grid-cols-4 gap-5'>
                <About />

                {!canSeePosts ? (
                    <p className='col-span-2 text-center mt-12 text-gray-500'>This account is private. Follow to see their posts and stories.</p>
                ) : (userPosts.length === 0) ? (
                    <p className='col-span-2 text-center mt-12 text-2xl text-gray-400'>No posts yet</p>
                ) : (
                    <ul className='col-span-2'>
                        {userPosts.slice().reverse().map((eachPost, index) => (
                            <li key={index}>
                                <PostCard
                                    name={selectedUser.name}
                                    description={eachPost.description}
                                    profile={selectedUser.pic}
                                    image={eachPost.media}
                                    likes={0}
                                    username={selectedUser.username}
                                    postId={eachPost.id}
                                    style='mt-3 px-auto'
                                />
                            </li>
                        ))}
                    </ul>
                )}

                <div className='col-span-1 space-y-4'>
                    <Connections componentTitle='Followings' usersToMap={userFollowings ? userFollowings : []} />
                    <Connections componentTitle='Followers' usersToMap={userFollowers ? userFollowers : []} />
                </div>
            </div>
        </div>
    );
}

export default Profile;
