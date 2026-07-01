import {useNavigate} from "react-router-dom";
import {useEffect, useMemo, useRef, useState} from "react";
import { createPortal } from 'react-dom'
import {useSelector} from "react-redux";
import { api } from "../../../../Data/api.js";

function SuggestedAccountCard({image, name, username, matches}) {
    const navigate = useNavigate();
    const loggedUser = useSelector(state => state.loggedUserData)
    const users = useSelector(state => state.users)
    const connections = useSelector(state => state.connections)
    const [isRequested, setIsRequested] = useState(false)
    const [showHint, setShowHint] = useState(false)
    const [hintPos, setHintPos] = useState(null)
    const cardRef = useRef(null)

    const targetUser = useMemo(() => users.find(u => u.username === username), [users, username])
    const isFollowed = useMemo(() => {
        if (!loggedUser || !targetUser) return false
        return connections.some(c => c.followerId === loggedUser.id && c.followingId === targetUser.id)
    }, [connections, loggedUser, targetUser])

    useEffect(() => {
        async function checkRequest() {
            if (!loggedUser || !targetUser) return
            const { data } = await api.get(`/follow_requests/check/${loggedUser.id}/${targetUser.id}`)
            setIsRequested(!!data)
        }
        checkRequest()
    }, [loggedUser, targetUser])

    async function handleFollow() {
        if (!loggedUser || !targetUser) return navigate(`/${username}/profile`)

        if (targetUser.private) {
            if (!isRequested) {
                await api.post('/follow_requests', { fromUserId: loggedUser.id, toUserId: targetUser.id })
                setIsRequested(true)
            }
            return
        }

        await api.post('/connections', { followerId: loggedUser.id, followingId: targetUser.id })
    }

    const followLabel = isFollowed ? '✔ Followed' : isRequested ? 'Requested' : '+ Follow'
    const followDisabled = isFollowed || isRequested

    const hintText = (() => {
        if (!matches || matches.length === 0) return ''
        const primary = matches[0]
        const more = Math.max(0, matches.length - 1)
        return `Interested in #${primary} just like you${more > 0 ? ` (+${more} more)` : ''}!`
    })()

    useEffect(() => {
        if (hintText && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect()
            setHintPos({ top: rect.top + window.scrollY, left: rect.left + window.scrollX - 8 })
            setShowHint(true)
            const t = setTimeout(() => setShowHint(false), 7000)
            return () => clearTimeout(t)
        }
    }, [hintText])

    return (
        <>
            <div
                className='relative bg-white shadow flex flex-row items-center my-2 py-4 px-2 text-[11px]'
                ref={cardRef}
            >
                <img className='w-12 rounded-full h-12 object-cover m-1 mr-2' src={image}/>
                <div className='truncate w-24'>
                    <h2 className='truncate'>{name}</h2>
                </div>

                <div className='flex flex-col ml-auto space-y-1 text-white'>
                    <button onClick={() => navigate(`/${username}/profile`)} className='bg-gray-300 p-1 rounded'>View Profile</button>
                    <button onClick={handleFollow} disabled={followDisabled} className={`${followDisabled ? 'bg-gray-300 cursor-not-allowed text-black' : 'bg-[#00DB7F]'} p-1 rounded`}>
                        {followLabel}
                    </button>
                </div>
                {hintText && showHint && hintPos && createPortal(
                    (
                        <div style={{ position: 'absolute', top: hintPos.top + 'px', left: hintPos.left + 'px' }} className='z-[9999]'>
                            <div className='relative -translate-x-full'>
                                <div className='bg-[#FA6A6B] text-white shadow-2xl rounded-xl px-3 py-2 max-w-[240px] text-[11px] animate-pulse'>
                                    {hintText}
                                </div>
                                <div className='absolute top-3 -right-1 w-2 h-2 bg-[#84C7AE] rotate-45'></div>
                            </div>
                        </div>
                    ),
                    document.body
                )}
            </div>
        </>
    )
}

export default SuggestedAccountCard;