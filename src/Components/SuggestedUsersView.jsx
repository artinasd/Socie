import AccountCards from "./UI Costume Elements/AccountCards.jsx";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import supabase from "../Data/supabase.js";
import {useEffect, useMemo, useState} from "react";
import loadingGIF from "../assets/loading.gif";

// A LIL ISSUE HERE IS THAT WHEN THERE ARE NO USERS CREATED, THE APP WILL SHOW LOADING GIF WITHOUT AN END.

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

    if (suggestedUsers.length === 0 || followedUsers.length === 0) {
        return (
            <div className='col-span-3 mx-auto my-64'><img className='w-12 opacity-50' src={loadingGIF}/></div>
        )
    }

    return (
        <div className='col-span-3'>

            <ul className='grid grid-cols-4 gap-y-10 mt-12'>
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