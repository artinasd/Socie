import AccountCards from "./UI Costume Elements/AccountCards.jsx";
import {useSelector} from "react-redux";
import {useEffect, useMemo, useState} from "react";
import loadingGIF from "../assets/loading.gif";

function SuggestedUsersView() {
    const [visibleSuggestedUsers, setVisibleSuggestedUsers] = useState(null)
    const loggedUser = useSelector(state => state.loggedUserData)
    const suggestedUsers = useSelector(state => state.users)
    const followedUsers = useSelector(state => state.connections)

    const rankedSuggestions = useMemo(() => {
        if (!suggestedUsers) return []
        if (!loggedUser) return suggestedUsers
        const favorites = Array.isArray(loggedUser.favorites) ? loggedUser.favorites.map(f => (f || '').toLowerCase()) : []
        const ranked = suggestedUsers
            .filter(u => u.username !== loggedUser.username)
            .map(u => {
                const uf = Array.isArray(u.favorites) ? u.favorites.map(f => (f || '').toLowerCase()) : []
                const overlap = uf.filter(f => favorites.includes(f))
                return { ...u, _score: overlap.length, _matches: overlap }
            })
            .sort((a, b) => b._score - a._score)
        return ranked
    }, [suggestedUsers, loggedUser])

    useEffect(() => {
        if (followedUsers && suggestedUsers && loggedUser) {
            setVisibleSuggestedUsers(
                rankedSuggestions.filter(user => {
                    const isAlreadyFollowed = followedUsers.some(
                        connection => connection.followerId === loggedUser.id && connection.followingId === user.id
                    );
                    return !isAlreadyFollowed;
                })
            );
        }
        else if (!loggedUser && suggestedUsers) {
            setVisibleSuggestedUsers(suggestedUsers);
        }
    }, [followedUsers, suggestedUsers, loggedUser, rankedSuggestions]);

    if (suggestedUsers === null || followedUsers === null) {
        return (
            <div className='col-span-3 mx-auto my-64'><img className='w-12 opacity-50' src={loadingGIF} alt="Loading..."/></div>
        )
    }

    if (visibleSuggestedUsers && visibleSuggestedUsers.length === 0) {
        return (
            <div className='col-span-3 mx-auto mt-32 text-center text-xl text-gray-500'>
                No new suggestions available right now.
            </div>
        )
    }

    return (
        <div className='col-span-3 px-6'>
            <h2 className="text-2xl font-bold mt-10 mb-2">Suggested For You</h2>
            <p className="text-gray-500 mb-8">Discover people you might want to follow</p>
            <ul className='flex flex-wrap gap-6'>
                {visibleSuggestedUsers && visibleSuggestedUsers.map((eachUser, index) =>
                    <li key={index}>
                        <AccountCards image={eachUser.pic} name={eachUser.name} username={eachUser.username} matches={eachUser._matches} />
                    </li>
                )}
            </ul>
        </div>
    )
}

export default SuggestedUsersView;