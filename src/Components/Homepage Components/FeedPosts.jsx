import PostCards from "../PostCards.jsx";
import {useSelector} from "react-redux";
import loadingGif from "../../assets/loading.gif";

function FeedPosts() {
    const loggedUser = useSelector(state => state.loggedUserData);
    const allPosts = useSelector(state => state.posts)
    const allConnections = useSelector(state => state.connections)

    if (allPosts === null || allConnections === null) {
        return <img src={loadingGif} className='w-10 mx-auto mt-10 opacity-50' alt="Loading..." />
    }

    let loggedUserFollowings;
    if (loggedUser) {
        const loggedUserId = loggedUser.id
        const followings = allConnections.filter(connection => connection.followerId === loggedUserId).map(connection => connection.followingId)
        loggedUserFollowings = [...followings, loggedUserId]
    }

    const postsToRender = loggedUserFollowings ? (
        allPosts.slice().reverse().filter(eachThing => loggedUserFollowings.includes(eachThing.posterId))
    ) : (
        allPosts.slice().reverse()
    )

    return (
        <div className='mt-6 pb-10'>
            {postsToRender.length > 0 ? (
                <ul className="flex flex-col items-center">
                    {postsToRender.map((eachPost, index) =>
                        <li key={index} className="w-full max-w-[680px]">
                            <PostCards name={eachPost.user?.name || "Unknown"}
                                       image={eachPost.media || null}
                                       profile={eachPost.user?.pic || ""}
                                       description={eachPost.description || null}
                                       username={eachPost.user?.username || "unknown"}
                                       postId={eachPost.id}
                                       style='w-full'
                            />
                        </li>
                    )}
                </ul>
            ) : (<div className='text-center mt-10 text-gray-500'>No posts to show.</div>)}
        </div>
    )
}

export default FeedPosts;