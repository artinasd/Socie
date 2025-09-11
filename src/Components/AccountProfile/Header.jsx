import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import supabase from "../../Data/supabase.js";
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
        <button onClick={followHandle}
                className='transition-all bg-white rounded-lg p-1 px-4 text-white text-lg'>
            <img src={loadingGIF} className='w-8'/>
        </button>
    )
    const location = useLocation()
    const { username: urlUsername } = useParams()

    const loggedUser = useSelector(state => state.loggedUser);
    const users = useSelector(state => state.users);
    const selectedUser = users.find(user => user.username === (urlUsername || username));

    useEffect(() => {
        if (loggedUser) {
            async function fetchLoggedUserId() {
                let {data: id, error } = await supabase
                   .from('users')
                   .select('id')
                   .eq('username', loggedUser)
                   .single()
               setLoggedUserId(id.id)
           }
           fetchLoggedUserId()
       }

        async function fetchUserId() {

            let { data: id, error } = await supabase
                .from('users')
                .select('id')
                .eq('username', username)
                .single()
            setUserId(id.id)
        }
        fetchUserId()

    }, [username, loggedUser]);

    // Open settings if navigated with state
    useEffect(() => {
        try {
            const st = window.history.state && window.history.state.usr
            if (st && st.openSettings && userId && loggedUserId && userId === loggedUserId) {
                setIsSettingsOpen(true)
                // clear so it doesn't reopen on back/forward
                window.history.replaceState({}, document.title)
            }
        } catch(e) {}
    }, [userId, loggedUserId])

    async function followHandle() {
        if (!isFollowing && !personalProfileState) {
            // Check if user profile is private
            const { data: targetUser } = await supabase
                .from('users')
                .select('id, private')
                .eq('id', userId)
                .single();

            if (targetUser?.private) {
                // Create a follow request instead
                await supabase
                    .from('follow_requests')
                    .insert([{ fromUserId: loggedUserId, toUserId: userId }]);
                alert('Follow request sent');
                setIsRequested(true)
                return;
            }

            const { data, error } = await supabase
                .from('connections')
                .insert([
                    { followerId: loggedUserId, followingId: userId },
                ])
                .select()

            setConnectionDone(true)
        } else if (personalProfileState) {
            // Open settings modal for personal profile
            setIsSettingsOpen(true)
        }
    }

    async function unfollowHandle() {
        const { error } = await supabase
            .from('connections')
            .delete()
            .eq('followingId', userId)
            .eq('followerId', loggedUserId)

        setConnectionDone(true)
    }

    useEffect(() => {
        if (userId && userId === loggedUserId) { // THE FIRST CONDITION IS ADDED TO AVOID THE PROGRAM TO SET THE STATE TO TRUE IN THE INITIAL RENDER WHEN THE ID'S ARE STILL NULL.
            setPersonalProfileState(true)
        }
    }, [userId, loggedUserId, username]);

    useEffect(() => {
        if (userId && loggedUserId) {
            async function fetchConnection() {
                try {
                    const { data: connection, error } = await supabase
                        .from('connections')
                        .select('*')
                        .eq('followerId', loggedUserId)
                        .eq('followingId', userId)
                        .maybeSingle();

                    // If there's an error or no connection is found, set to false.
                    if (error || !connection) {
                        setIsFollowing(false);
                    } else {
                        // If the try block executes without errors and a connection exists, set to true.
                        setIsFollowing(true);
                        setPersonalProfileState(false)
                    }
                } catch (error) {
                    setIsFollowing(false);
                }
            }

            async function fetchRequest() {
                try {
                    const { data: request } = await supabase
                        .from('follow_requests')
                        .select('id')
                        .eq('fromUserId', loggedUserId)
                        .eq('toUserId', userId)
                        .maybeSingle();
                    setIsRequested(!!request)
                } catch (e) {
                    setIsRequested(false)
                }
            }

            fetchConnection();
            fetchRequest();
        }
    }, [connectionDone, userId, loggedUserId, username]);

    useEffect(() => {
        if (!loggedUser) {
            setDynamicButton(
                <div className='text-gray-500 text-sm'>Login to follow</div>
            )
            return;
        }

        if (personalProfileState === true) {
            setDynamicButton(
                <button onClick={followHandle}
                        className='text-black hover:bg-gray-50 bg-white border border-gray-600 transition-all rounded-lg p-1 px-4 text-lg'>
                    Settings
                </button>
            )
        } else if (isFollowing) {
            setDynamicButton(
                <button onClick={unfollowHandle}
                    className='bg-blue-400 rounded-lg p-1 px-4 text-white text-lg'>
                    ✔ Followed
                </button>
            )
        } else if (isRequested) {
            setDynamicButton(
                <button disabled className='bg-gray-300 rounded-lg p-1 px-4 text-black text-lg cursor-not-allowed'>
                    Requested
                </button>
            )
        } else if (!isFollowing && !personalProfileState && userId && loggedUserId) {
            setDynamicButton(
                <button onClick={followHandle}
                        className='hover:bg-green-300 transition-all bg-[#00DB7F] rounded-lg p-1 px-4 text-white text-lg'>
                    + Follow
                </button>
            )
        }
    }, [isFollowing, isRequested, personalProfileState, location, userId, connectionDone, loggedUser]);

    return (
        <div className='bg-white rounded-xl overflow-hidden shadow-lg'>
            <div className='w-full h-80 bg-gray-200 overflow-hidden'>
                <img 
                    src={selectedUser?.header_pic || header} 
                    alt="Header"
                    className='w-full h-full object-cover'
                />
            </div>

            <div className='px-32'>

                <img className='w-32 h-32 rounded-full relative -mt-24' src={profile}/>

                <div className='mt-2 mb-6'>
                    <div className='flex flex-row items-center justify-between'>

                        <div className='flex flex-row space-x-5'>
                            <div>
                                <h2 className='font-bold text-4xl'>{name}</h2>
                                <p className='text-gray-700 font-light mt-2'>@{username}</p>
                            </div>

                            <div className='flex flex-row space-x-2 text-gray-700 scale-[80%]'>
                                <div>
                                    <p className='text-xl font-bold'>{following}</p>
                                    <p className='text-[10px]'>Following</p>
                                </div>
                                <hr className='border-l h-[40%] mt-2 border-gray-400' />
                                <div>
                                    <p className='text-xl font-bold'>{follower}</p>
                                    <p className='text-[10px]'>Follower</p>
                                </div>
                            </div>
                        </div>

                        <div>
                            {dynamicButton}
                        </div>
                    </div>

                </div>

            </div>
            
            <SettingsModal 
                isOpen={isSettingsOpen} 
                onClose={() => setIsSettingsOpen(false)} 
            />
        </div>
    )
}

export default Header;