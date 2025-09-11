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

    let endSliceIndex = 2
    let expandButton = <></>
    let conditionalContent = <>
        <div className='bg-gradient-to-t from-gray-100 to-white h-[73px] rounded-b-xl flex items-center justify-center'>
            <button onClick={handleLoadButton}>
                <p className='text-gray-700 underline hover:text-blue-400 text-blue-500'>Load More</p>
            </button>
        </div>
    </>

    function handleLoadButton() {
        setLoadState(true)
    }

    if (loadState === true) {
        endSliceIndex = 8

        expandButton = <button onClick={() => navigate('/suggestions')}>
            <p className='text-xs text-blue-400 underline'>Show All</p>
        </button>

        conditionalContent = <></>
    }

    if (loadState === false && suggestedUsers.length === 0) {
        conditionalContent = (
            <div className='col-span-3'><img className='w-6 opacity-50 mx-auto mb-6' src={loadingGIF}/></div>
        )
    }

    return (
        <>
            <div className='mr-3 mt-3 mb-3'>
                <div style={{scrollbarWidth: "none"}} className={`bg-white rounded-xl shadow-lg w-[270px] max-h-[359px] overflow-y-scroll`}>
                    <div className='px-5 pt-5 flex flex-row justify-between sticky top-0 bg-white'>
                        <h2 className='text-gray-400 text-xs font-bold'>Suggestions</h2>
                        {expandButton}
                    </div>

                    <ul className='space-y-6 mt-5 px-5 pb-2'>
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