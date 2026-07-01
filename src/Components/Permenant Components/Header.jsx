import siteLogo from '../../assets/siteLogo.png'
import magnifier from '../../assets/magnifier.png'
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";
import {useEffect, useRef, useState} from "react";
import { createPortal } from 'react-dom'
import {useDispatch} from "react-redux";
import {loggedUserActions} from "../../Data/loggedInUserSlice.js";
import { api } from "../../Data/api.js";

function Header () {
    const navigate = useNavigate();
    const reduxLoggedUserState = useSelector((state) => state.loggedUser)
    const [loggedUser, setLoggedUser] = useState(null)
    const [isHoveringState, setIsHoveringState] = useState(false)
    const dispatch = useDispatch()
    const allUsers = useSelector(state => state.users)
    const [searchQuery, setSearchQuery] = useState('')
    const [searchResults, setSearchResults] = useState([])
    const [isSearchOpen, setIsSearchOpen] = useState(false)
    const [searchTimer, setSearchTimer] = useState(null)
    const inputRef = useRef(null)
    const [dropdownPos, setDropdownPos] = useState(null)

    useEffect(() => {
        if (reduxLoggedUserState) {
            async function fetchUser () {
                const {data: users, error} = await api.get('/users')
                if (!error && users) {
                    setLoggedUser(users.find(u => u.username === reduxLoggedUserState))
                }
            }
            fetchUser()
        }
    }, [reduxLoggedUserState]);

    function hoverHandle() {
        setIsHoveringState(true)
    }

    function hoverOverHandle() {
        setTimeout(() => {setIsHoveringState(false)}, 1000)
    }

    function logoutHandle() {
        dispatch(loggedUserActions.setLoggedUser(''))
        window.location.reload()
    }

    function updateDropdownPosition() {
        if (!inputRef.current) return
        const rect = inputRef.current.getBoundingClientRect()
        setDropdownPos({
            top: rect.bottom + window.scrollY + 8,
            left: rect.left + window.scrollX,
            width: rect.width
        })
    }

    function handleSearchChange(e) {
        const value = e.target.value
        setSearchQuery(value)
        updateDropdownPosition()
        if (searchTimer) clearTimeout(searchTimer)
        const timer = setTimeout(() => {
            if (!value.trim()) {
                setSearchResults([])
                return
            }
            const q = value.toLowerCase()
            const results = (allUsers || []).filter(u =>
                (u.username && u.username.toLowerCase().includes(q)) ||
                (u.name && u.name.toLowerCase().includes(q))
            ).slice(0, 8)
            setSearchResults(results)
        }, 200)
        setSearchTimer(timer)
    }

    function handleSelectUser(user) {
        setIsSearchOpen(false)
        setSearchQuery('')
        setSearchResults([])
        navigate(`/${user.username}/profile`)
    }

    useEffect(() => {
        if (!isSearchOpen) return
        updateDropdownPosition()
        function onWin() { updateDropdownPosition() }
        window.addEventListener('resize', onWin)
        window.addEventListener('scroll', onWin, true)
        return () => {
            window.removeEventListener('resize', onWin)
            window.removeEventListener('scroll', onWin, true)
        }
    }, [isSearchOpen])

    return (
        <div className='sticky top-0 z-10'>
            <div className='bg-white h-24 top sticky flex flex-row items-center grid grid-cols-3'>
                <div className='flex items-center col-span-1'>
                    <img src={siteLogo} className='w-20'/>
                    <h1 className='font-bold text-3xl bg-gradient-to-r from-cyan-400 to-fuchsia-400 text-transparent bg-clip-text'>Socie
                        :)</h1>
                </div>

                <div className="col-span-1 mx-auto relative z-[200]" onFocus={() => { setIsSearchOpen(true); updateDropdownPosition() }} onBlur={() => setTimeout(() => setIsSearchOpen(false), 150)}>
                    <img
                        className="absolute w-6 top-2 left-3 opacity-20 pointer-events-none" src={magnifier}/>
                    <input
                        ref={inputRef}
                        type="search" value={searchQuery} onChange={handleSearchChange} placeholder="Search people..." className="h-10 pl-12 pr-2 pb-1 rounded-full bg-gray-200 w-72 hover:bg-gray-50
                                  focus:outline-none focus:bg-gray-100 transition-all duration-300 focus:w-96"/>

                    {isSearchOpen && searchResults.length > 0 && dropdownPos && createPortal(
                        (
                            <div style={{position: 'absolute', top: dropdownPos.top + 'px', left: dropdownPos.left + 'px', width: dropdownPos.width + 'px'}} className='bg-white rounded-xl shadow-2xl border border-gray-100 overflow-hidden z-[9999]'>
                                <ul className='max-h-80 overflow-y-auto' style={{scrollbarWidth: 'none'}}>
                                    {searchResults.map(u => (
                                        <li key={u.id}>
                                            <button onMouseDown={() => handleSelectUser(u)} className='w-full text-left px-3 py-2 hover:bg-gray-50 flex items-center gap-3'>
                                                <img src={u.pic} className='w-8 h-8 rounded-full object-cover'/>
                                                <div className='truncate'>
                                                    <p className='text-sm font-medium truncate'>{u.name}</p>
                                                    <p className='text-xs text-gray-500 truncate'>@{u.username}</p>
                                                </div>
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ),
                        document.body
                    )}
                </div>
            </div>

            <div className='col-span-1 ml-auto p-4 z-50 top-0 absolute right-0'>
                {reduxLoggedUserState ? (
                        <>
                            <img onClick={() => navigate(`/${reduxLoggedUserState}/profile`)}
                                 onMouseOver={hoverHandle}
                                 onMouseOut={hoverOverHandle}
                                 src={loggedUser ? loggedUser.pic : ''}
                                 className='rounded-full w-[60px] h-[60px] border-2 border-black p-1 object-cover cursor-pointer
                                                hover:border-cyan-400 transition-all duration-300'/>
                            {isHoveringState &&
                                <div className='absolute z-50 mt-2 transition right-4'>
                                    <menu className='p-3 bg-gray-50 drop-shadow z-50 rounded-lg'>
                                        <li><button onClick={logoutHandle} className='hover:underline'>Logout</button></li>
                                    </menu>
                                </div>
                            }
                        </>
                    ) :
                    <p className='mt-5'>
                        <button className='hover:underline' onClick={() => navigate('/sign-up')}>Log In / Sign Up</button>
                    </p>
                }
            </div>

            <div className='bg-gray-50 -mt-[12px] drop-shadow text-gray-500 relative z-[5]'>
                <ul className='flex space-x-[100px] mt-3 justify-center py-2'>
                    <div className='border-l'/>
                    <li className='opacity-100'>
                        <button onClick={() => navigate('/')}>Feed</button>
                    </li>
                    <div className='border-l'/>
                    <li>
                        <button>Discover</button>
                    </li>
                    <div className='border-l'/>
                    <li>
                        <button>Stories</button>
                    </li>
                    <div className='border-l'/>
                    <li>
                        <button onClick={() => navigate(`/${reduxLoggedUserState}/profile`)}>Profile</button>
                    </li>
                    <div className='border-l'/>
                </ul>
            </div>
        </div>
    )
}

export default Header;