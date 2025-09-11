import {useEffect, useRef, useState} from "react";
import {loggedUserActions} from "../../Data/loggedInUserSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import supabase from "../../Data/supabase.js";

function LogInForm() {
    const passwordRef = useRef('')
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [userExists, setUserExists] = useState(false)
    const [userAuthenticated, setUserAuthenticated] = useState(false)
    const [isDisabled, setIsDisabled] = useState(null);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (username) {
            async function fetchUsers() {
                let { data: users, error } = await supabase
                    .from('users')
                    .select('*')
                    .eq('username', username)
                    .single()
                setUserExists(true)
            }
            fetchUsers()
        }
    }, [username]);

    async function loginHandle() {
        setIsDisabled(true)
        let { data: users, error } = await supabase
            .from('users')
            .select('password')
            .eq('username', username)
            .single()

        setPassword(users.password)
        setUserAuthenticated(true)
    }

    useEffect(() => {
        if (userExists) {
            if (passwordRef.current.value === password) {
                dispatch(loggedUserActions.setLoggedUser(username))
                navigate(`/${username}/profile`)
            }
        }
    }, [userAuthenticated]);

    return (
        <div className='bg-[#C1E3D6] w-screen h-screen flex items-center justify-center'>
            <div className='bg-[#F6FBF9] rounded-xl w-1/3 h-2/3 space-y-4 p-10 flex flex-col items-center'>
                <h1 className='font-bold text-3xl'>Sign In To Your Account</h1>
                <p className='text-center px-4 text-lg font-light'>
                    Log back to your account and check out all you've missed while you've been away
                </p>

                <div className='flex flex-col space-y-4 w-72'>
                    <input
                        required={true}
                        placeholder='Username'
                        type='text'
                        onBlur={e => setUsername(e.target.value)}
                        className='p-3 rounded-xl mt-8 border border-gray-200'/>

                    <input
                        required={true}
                        placeholder='Password'
                        type='password'
                        ref={passwordRef}
                        className='p-3 rounded-xl border border-gray-200'/>

                    <input
                        disabled={isDisabled}
                        type='submit'
                        value={`${!isDisabled ? 'Login' : 'Please Wait...'}`}
                        onClick={loginHandle}
                        className={`p-3 rounded-xl text-white mx-10 transition duration-300 font-bold
                            ${isDisabled ? 'bg-gray-400' : 'bg-[#84C7AE] hover:bg-green-400'}`}/>
                </div>
            </div>
        </div>
    );
}

export default LogInForm;
