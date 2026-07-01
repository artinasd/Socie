import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loggedUserActions } from "../../Data/loggedInUserSlice.js";
import { useNavigate } from "react-router-dom";
import { api } from "../../Data/api.js";

function SignUpForm() {
    const nameRef = useRef();
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function submitHandle(event) {
        event.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        const newUser = {
            name: nameRef.current.value.trim(),
            username: usernameRef.current.value.trim(),
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value,
            pic: 'https://cdn-icons-png.flaticon.com/512/149/149071.png' // Default pic
        };

        if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
            setErrorMsg('All fields are required.');
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await api.post('/users', newUser);

            if (error) {
                setErrorMsg('Username or Email might already be taken.');
            } else {
                dispatch(loggedUserActions.setLoggedUser(data.username));
                navigate('/complete-signup'); // Direct to avatar/bio setup
            }
        } catch (err) {
            setErrorMsg('Server error. Please try again later.');
        }

        setIsLoading(false);
    }

    return (
        <div className='flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg w-full max-w-sm mx-auto mt-10'>
            <h2 className='text-2xl font-bold text-gray-700 mb-6'>Create Account</h2>
            {errorMsg && <p className='text-red-500 text-sm mb-4 bg-red-50 p-2 rounded w-full text-center'>{errorMsg}</p>}

            <form onSubmit={submitHandle} className='w-full space-y-4'>
                <input ref={nameRef} type='text' placeholder='Full Name'
                       className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition' />
                <input ref={usernameRef} type='text' placeholder='Username'
                       className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition' />
                <input ref={emailRef} type='email' placeholder='Email Address'
                       className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition' />
                <input ref={passwordRef} type='password' placeholder='Password'
                       className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition' />

                <button type="submit" disabled={isLoading}
                        className={`w-full text-white font-bold py-3 rounded-lg transition ${isLoading ? 'bg-green-300 cursor-not-allowed' : 'bg-[#00DB7F] hover:bg-green-500'}`}>
                    {isLoading ? 'Creating...' : 'Sign Up'}
                </button>
            </form>
        </div>
    );
}

export default SignUpForm;