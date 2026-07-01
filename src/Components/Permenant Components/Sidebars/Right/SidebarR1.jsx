import {useEffect, useState} from "react";
import {useSelector} from "react-redux";
import { api } from "../../../../Data/api.js";

function SidebarR1 () {
    const loggedUser = useSelector(state => state.loggedUserData)
    const [requests, setRequests] = useState([])
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        async function fetchRequests() {
            if (!loggedUser) return;
            setIsLoading(true)
            const { data, error } = await api.get('/follow_requests')

            if (error) {
                setRequests([])
                setIsLoading(false)
                return
            }

            const reqs = (data || []).filter(r => r.toUserId === loggedUser.id)
            const fromIds = Array.from(new Set(reqs.map(r => r.fromUserId)))
            let usersMap = {}
            if (fromIds.length > 0) {
                const { data: usersData } = await api.get('/users')
                usersMap = (usersData || []).reduce((acc, u) => { acc[u.id] = u; return acc }, {})
            }

            const enriched = reqs.map(r => ({ ...r, fromUser: usersMap[r.fromUserId] }))
            setRequests(enriched)
            setIsLoading(false)
        }

        fetchRequests()
    }, [loggedUser])

    async function handleAccept(req) {
        await api.post('/connections', { followerId: req.fromUserId, followingId: req.toUserId })
        await api.delete('/follow_requests', { id: req.id })
        setRequests(prev => prev.filter(r => r.id !== req.id))
    }

    async function handleDecline(req) {
        await api.delete('/follow_requests', { id: req.id })
        setRequests(prev => prev.filter(r => r.id !== req.id))
    }

    return (
        <>
            <div className='mr-3 mt-3'>
                <div className='p-5 bg-white rounded-xl shadow-lg w-full max-w-[270px] lg:w-[270px]'>
                    <h2 className='text-gray-400 text-xs font-bold'>Follow Requests</h2>

                    {(!loggedUser) && (
                        <div className='flex flex-row items-center justify-center mt-12 mb-12 text-sm text-gray-400'>
                            <p>Log in to see requests</p>
                        </div>
                    )}

                    {(loggedUser) && (
                        <div>
                            {isLoading ? (
                                <div className='flex flex-row items-center justify-center mt-12 mb-12 text-sm text-gray-400'>
                                    <p>Loading...</p>
                                </div>
                            ) : requests.length === 0 ? (
                                <div className='flex flex-row items-center justify-center mt-12 mb-12 text-sm text-gray-400'>
                                    <p>Empty for now!</p>
                                </div>
                            ) : (
                                <ul className='space-y-3 mt-4'>
                                    {requests.map(req => (
                                        <li key={req.id} className='flex items-center justify-between text-[12px]'>
                                            <div className='flex items-center gap-2 overflow-hidden'>
                                                {req.fromUser?.pic && (
                                                    <img src={req.fromUser.pic} className='w-6 h-6 rounded-full object-cover'/>
                                                )}
                                                <span className='truncate max-w-[110px]'>@{req.fromUser?.username || req.fromUserId}</span>
                                            </div>
                                            <div className='flex gap-2'>
                                                <button onClick={() => handleAccept(req)} className='px-2 py-1 rounded bg-[#84C7AE] text-white'>Accept</button>
                                                <button onClick={() => handleDecline(req)} className='px-2 py-1 rounded bg-gray-200'>Decline</button>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}

export default SidebarR1;