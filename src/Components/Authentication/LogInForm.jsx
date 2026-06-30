import {useRef, useState} from "react";
import {loggedUserActions} from "../../Data/loggedInUserSlice.js";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import supabase from "../../Data/supabase.js";

function LogInForm() {
    const passwordRef = useRef('')
    const [username, setUsername] = useState('');
    const [isDisabled, setIsDisabled] = useState(false);
    const [errorMsg, setErrorMsg] = useState('');
    const dispatch = useDispatch()
    const navigate = useNavigate()

    async function loginHandle(e) {
        e.preventDefault();
        setErrorMsg('');
        setIsDisabled(true);

        if (!username || !passwordRef.current.value) {
            setErrorMsg("Please fill in both fields");
            setIsDisabled(false);
            return;
        }

        let { data: user, error } = await supabase
            .from('users')
            .select('password')
            .eq('username', username)
            .single()

        if (error || !user) {
            setErrorMsg("User not found");
            setIsDisabled(false);
            return;
        }

        if (passwordRef.current.value === user.password) {
            dispatch(loggedUserActions.setLoggedUser(username))
            navigate(`/${username}/profile`)
        } else {
            setErrorMsg("Incorrect password");
            setIsDisabled(false);
        }
    }

    return (
        <div className='bg-[#C1E3D6] w-screen h-screen flex items-center justify-center'>
            <div className='bg-[#F6FBF9] rounded-xl w-1/3 h-2/3 space-y-4 p-10 flex flex-col items-center shadow-lg'>
                <h1 className='font-bold text-3xl'>Sign In To Your Account</h1>
                <p className='text-center px-4 text-lg font-light'>
                    Log back to your account and check out all you've missed while you've been away
                </p>

                <form onSubmit={loginHandle} className='flex flex-col space-y-4 w-72'>
                    <input
                        required={true}
                        placeholder='Username'
                        type='text'
                        value={username}
                        onChange={e => setUsername(e.target.value)}
                        className='p-3 rounded-xl mt-8 border border-gray-200 focus:outline-none focus:border-[#84C7AE]'/>

                    <input
                        required={true}
                        placeholder='Password'
                        type='password'
                        ref={passwordRef}
                        className='p-3 rounded-xl border border-gray-200 focus:outline-none focus:border-[#84C7AE]'/>

                    {errorMsg && <p className="text-red-500 text-sm text-center">{errorMsg}</p>}

                    <button
                        disabled={isDisabled}
                        type='submit'
                        className={`p-3 rounded-xl text-white mx-10 transition duration-300 font-bold
                            ${isDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-[#84C7AE] hover:bg-green-400 shadow-md'}`}>
                        {isDisabled ? 'Please Wait...' : 'Login'}
                    </button>

                    <p className='text-center pt-2 text-xs'>Don't have an account?<br/> Click here to &nbsp;
                        <button type="button" onClick={() => navigate('/sign-up')} className='hover:underline text-blue-500 font-semibold'>sign up</button>
                    </p>
                </form>
            </div>
        </div>
    );
}

export default LogInForm;