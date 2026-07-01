import SuggestedAccountCard from "./SuggestedAccountCard.jsx";
import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import loadingGIF from "../../../../assets/loading.gif";

function SidebarR2 () {
    const navigate = useNavigate()
    const [loadState, setLoadState] = useState(false)
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
        } else if (!loggedUser && suggestedUsers) {
            setVisibleSuggestedUsers(suggestedUsers);
        }
    }, [followedUsers, suggestedUsers, loggedUser, rankedSuggestions]);

    let endSliceIndex = 3
    let expandButton = <></>
    let conditionalContent = <>
        <div className='bg-gradient-to-t from-gray-100 to-white h-[73px] rounded-b-xl flex items-center justify-center border-t border-gray-100'>
            <button onClick={() => setLoadState(true)} className="px-4 py-2 hover:bg-gray-100 rounded-full transition-colors">
                <p className='text-sm font-medium text-blue-500'>Show More</p>
            </button>
        </div>
    </>

    if (loadState === true) {
        endSliceIndex = 8
        expandButton = <button onClick={() => navigate('/suggestions')} className="hover:underline">
            <p className='text-xs text-blue-500 font-medium'>See All</p>
        </button>
        conditionalContent = <></>
    }

    if (suggestedUsers === null || followedUsers === null) {
        conditionalContent = (
            <div className='py-8'><img className='w-6 opacity-50 mx-auto' src={loadingGIF} alt="Loading..."/></div>
        )
    } else if (visibleSuggestedUsers && visibleSuggestedUsers.length === 0) {
        conditionalContent = (
            <div className='text-center py-6 text-sm text-gray-500'>Caught up for now!</div>
        )
    }

    return (
        <>
            <div className='mr-3 mt-3 mb-6'>
                <div style={{scrollbarWidth: "none"}} className={`bg-white rounded-xl shadow-sm border border-gray-100 w-full max-w-[270px] lg:w-[270px] max-h-[420px] overflow-y-scroll`}>
                    <div className='px-5 py-4 flex flex-row justify-between items-center sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-gray-50'>
                        <h2 className='text-gray-500 text-xs font-bold uppercase tracking-wider'>Suggestions</h2>
                        {expandButton}
                    </div>

                    <ul className='mt-2 px-3 pb-2'>
                        {visibleSuggestedUsers && visibleSuggestedUsers.slice(0, endSliceIndex).map((each, index) => (
                            <li key={index}>
                                <SuggestedAccountCard username={each.username} image={each.pic} name={each.name} matches={each._matches} />
                            </li>
                        ))}
                    </ul>

                    {conditionalContent}
                </div>
            </div>
        </>
    )
}

export default SidebarR2;