import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import { api } from "../../Data/api.js";
import loadingGIF from "../../assets/loading.gif"
import {useLocation, useParams} from "react-router";
import SettingsModal from "../SettingsModal.jsx";

function Header({header, follower, following, name, profile, username}) {
    const [personalProfileState, setPersonalProfileState] = useState(false)
    const [loggedUserId, setLoggedUserId] = useState(null)
    const [userId, setUserId] = useState(null)
    const [connectionDone, setConnectionDone] = useState(null)
    const [isFollowing, setIsFollowing] = useState(null)
    const [isRequested, setIsRequested] = useState(false)
    const [isSettingsOpen, setIsSettingsOpen] = useState(false)
    const [dynamicButton, setDynamicButton] = useState(
        <button className='transition-all bg-white rounded-lg p-1 px-4 text-white text-lg'><img src={loadingGIF} className='w-8'/></button>
    )
    const location = useLocation()
    const { username: urlUsername } = useParams()

    const loggedUser = useSelector(state => state.loggedUser);
    const users = useSelector(state => state.users) || [];
    const selectedUser = users.find(user => user.username === (urlUsername || username));

    useEffect(() => {
        if (loggedUser) {
            const lUser = users.find(u => u.username === loggedUser);
            if (lUser) setLoggedUserId(lUser.id);
        }
        if (selectedUser) setUserId(selectedUser.id);
    }, [username, loggedUser, users, selectedUser]);

    useEffect(() => {
        try {
            const st = window.history.state && window.history.state.usr
            if (st && st.openSettings && userId && loggedUserId && userId === loggedUserId) {
                setIsSettingsOpen(true)
                window.history.replaceState({}, document.title)
            }
        } catch(e) {}
    }, [userId, loggedUserId])

    async function followHandle() {
        if (!isFollowing && !personalProfileState && loggedUserId && userId) {
            if (selectedUser?.private && !isRequested) {
                await api.post('/follow_requests', { fromUserId: loggedUserId, toUserId: userId });
                alert('Follow request sent');
                setIsRequested(true)
                return;
            }
            await api.post('/connections', { followerId: loggedUserId, followingId: userId });
            setConnectionDone(Date.now());
        } else if (personalProfileState) {
            setIsSettingsOpen(true)
        }
    }

    async function unfollowHandle() {
        if (!loggedUserId || !userId) return;
        await api.delete('/connections', { followerId: loggedUserId, followingId: userId });
        setConnectionDone(Date.now());
    }

    useEffect(() => {
        if (userId && userId === loggedUserId) setPersonalProfileState(true)
    }, [userId, loggedUserId]);

    useEffect(() => {
        if (userId && loggedUserId) {
            async function fetchConnection() {
                const { data: connections } = await api.get('/connections');
                const connection = connections?.find(c => c.followerId === loggedUserId && c.followingId === userId);
                if (connection) {
                    setIsFollowing(true);
                    setPersonalProfileState(false);
                } else setIsFollowing(false);
            }
            async function fetchRequest() {
                const { data: request } = await api.get(`/follow_requests/check/${loggedUserId}/${userId}`);
                setIsRequested(!!request)
            }
            fetchConnection();
            fetchRequest();
        }
    }, [connectionDone, userId, loggedUserId]);

    useEffect(() => {
        if (!loggedUser) {
            setDynamicButton(<div className='text-gray-500 text-sm'>Login to follow</div>); return;
        }
        if (personalProfileState === true) {
            setDynamicButton(<button onClick={followHandle} className='text-black hover:bg-gray-50 bg-white border border-gray-600 transition-all rounded-lg p-1 px-4 text-lg'>Settings</button>)
        } else if (isFollowing) {
            setDynamicButton(<button onClick={unfollowHandle} className='bg-blue-400 rounded-lg p-1 px-4 text-white text-lg'>✔ Followed</button>)
        } else if (isRequested) {
            setDynamicButton(<button disabled className='bg-gray-300 rounded-lg p-1 px-4 text-black text-lg cursor-not-allowed'>Requested</button>)
        } else if (!isFollowing && !personalProfileState && userId && loggedUserId) {
            setDynamicButton(<button onClick={followHandle} className='hover:bg-green-300 transition-all bg-[#00DB7F] rounded-lg p-1 px-4 text-white text-lg'>+ Follow</button>)
        }
    }, [isFollowing, isRequested, personalProfileState, userId, loggedUser]);

    return (
        <div className='bg-white rounded-xl overflow-hidden shadow-lg'>
            <div className='w-full h-80 bg-gray-200 overflow-hidden'>
                <img src={selectedUser?.header_pic || header} className='w-full h-full object-cover'/>
            </div>
            <div className='px-32'>
                <img className='w-32 h-32 rounded-full relative -mt-24 bg-white border-4 border-white' src={profile}/>
                <div className='mt-2 mb-6'>
                    <div className='flex flex-row items-center justify-between'>
                        <div className='flex flex-row space-x-5'>
                            <div>
                                <h2 className='font-bold text-4xl'>{name}</h2>
                                <p className='text-gray-700 font-light mt-2'>@{username}</p>
                            </div>
                            <div className='flex flex-row space-x-2 text-gray-700 scale-[80%]'>
                                <div><p className='text-xl font-bold'>{following}</p><p className='text-[10px]'>Following</p></div>
                                <hr className='border-l h-[40%] mt-2 border-gray-400' />
                                <div><p className='text-xl font-bold'>{follower}</p><p className='text-[10px]'>Follower</p></div>
                            </div>
                        </div>
                        <div>{dynamicButton}</div>
                    </div>
                </div>
            </div>
            <SettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
        </div>
    )
}

export default Header;