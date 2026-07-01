import { useRef, useState } from "react";

function SignUpForm({ nextStep, updateUserData }) {
    const nameRef = useRef();
    const usernameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const [errorMsg, setErrorMsg] = useState('');

    function submitHandle(event) {
        event.preventDefault();
        setErrorMsg('');

        const newUser = {
            name: nameRef.current.value.trim(),
            username: usernameRef.current.value.trim(),
            email: emailRef.current.value.trim(),
            password: passwordRef.current.value,
        };

        if (!newUser.name || !newUser.username || !newUser.email || !newUser.password) {
            setErrorMsg('All fields are required.');
            return;
        }

        // Just update data and move to the next step
        updateUserData(newUser);
        nextStep();
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

                <button type="submit"
                        className='w-full text-white font-bold py-3 rounded-lg transition bg-[#00DB7F] hover:bg-green-500'>
                    Next
                </button>
            </form>
        </div>
    );
}

export default SignUpForm;