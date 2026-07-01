import { useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { loggedUserActions } from "../../Data/loggedInUserSlice.js";
import { useNavigate } from "react-router-dom";
import { api } from "../../Data/api.js";

function LogInForm() {
    const usernameRef = useRef();
    const passwordRef = useRef();
    const [errorMsg, setErrorMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    async function submitHandle(event) {
        event.preventDefault();
        setErrorMsg('');
        setIsLoading(true);

        const credentials = {
            username: usernameRef.current.value.trim(),
            password: passwordRef.current.value
        };

        if (!credentials.username || !credentials.password) {
            setErrorMsg('Please enter both username and password.');
            setIsLoading(false);
            return;
        }

        try {
            const { data, error } = await api.post('/users/login', credentials);

            if (error || !data) {
                setErrorMsg(error || 'Invalid username or password.');
            } else {
                dispatch(loggedUserActions.setLoggedUser(data.username));
                navigate('/');
            }
        } catch (err) {
            setErrorMsg('Server error. Please try again later.');
        }

        setIsLoading(false);
    }

    return (
        <div className='flex flex-col items-center justify-center p-8 bg-white rounded-xl shadow-lg w-full max-w-sm mx-auto mt-10'>
            <h2 className='text-2xl font-bold text-gray-700 mb-6'>Welcome Back</h2>
            {errorMsg && <p className='text-red-500 text-sm mb-4 bg-red-50 p-2 rounded w-full text-center'>{errorMsg}</p>}

            <form onSubmit={submitHandle} className='w-full space-y-4'>
                <div>
                    <input ref={usernameRef} type='text' placeholder='Username'
                           className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition' />
                </div>
                <div>
                    <input ref={passwordRef} type='password' placeholder='Password'
                           className='w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:border-blue-500 transition' />
                </div>

                <button type="submit" disabled={isLoading}
                        className={`w-full text-white font-bold py-3 rounded-lg transition ${isLoading ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}>
                    {isLoading ? 'Logging in...' : 'Log In'}
                </button>
            </form>
        </div>
    );
}

export default LogInForm;