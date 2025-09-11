import PostCards from "../PostCards.jsx";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import supabase from "../../Data/supabase.js";
import loadingGif from "../../assets/loading.gif";

function FeedPosts() {
    const loggedUser = useSelector(state => state.loggedUserData);
    const allPosts = useSelector(state => state.posts)
    const allConnections = useSelector(state => state.connections)

    let loggedUserFollowings;
    if (loggedUser) {
        const loggedUserId = loggedUser.id
        const followings = allConnections.filter(connection => connection.followerId === loggedUserId).map(connection => connection.followingId)
        loggedUserFollowings = [...followings, loggedUserId]
    }

    // const isLoading = !allPosts || !loggedUserFollowings
    // if (isLoading) {
    //     return <img src={loadingGif} className='w-10 mx-auto mt-6' />
    // }

    const postsToRender = loggedUserFollowings ? (
        allPosts.slice().reverse().filter(eachThing => loggedUserFollowings.includes(eachThing.posterId))
    ) : (
        allPosts.slice().reverse()
    )

    return (
        <div className='mt-6'>
            {allPosts.length > 0 ? (
                <ul>
                    {postsToRender.map((eachPost, index) =>
                        <li key={index}>
                            <PostCards name={eachPost.user.name}
                                       image={eachPost.media || null}
                                       profile={eachPost.user.pic}
                                       description={eachPost.description || null}
                                       username={eachPost.user.username}
                                       postId={eachPost.id}
                                       style='w-[680px]'
                            />
                        </li>
                    )}
                </ul>
            ) : (<img src={loadingGif} className='w-10 mx-auto mt-6' />)}
        </div>
    )
}

export default FeedPosts;