import {useState} from "react";
import {useNavigate} from "react-router-dom";

function SignUpForm({nextStep, updateUserData}) {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    function handleSubmit() {
        updateUserData({email, password});
        nextStep();
    }

    return (
        <div className='bg-[#C1E3D6] w-screen h-screen flex items-center justify-center'>
            <div className='bg-[#F6FBF9] rounded-xl w-1/3 h-2/3 space-y-4 p-10 flex flex-col items-center'>
                <h1 className='font-bold text-3xl'>Create A New Account</h1>
                <p className='text-center px-4 text-lg font-light'>
                    Create an account to enjoy all our services without any ads for free :)
                </p>

                <div className='flex flex-col space-y-4 w-72'>
                    <input
                        required={true}
                        placeholder='Email Address'
                        type='email'
                        onChange={(e) => setEmail(e.target.value)}
                        className='p-3 rounded-xl mt-8 border border-gray-200'/>

                    <input
                        required={true}
                        placeholder='Password'
                        type='password'
                        onChange={(e) => setPassword(e.target.value)}
                        className='p-3 rounded-xl border border-gray-200'/>

                    <input
                        type='submit'
                        value='Next'
                        onClick={handleSubmit}
                        className='font-bold bg-[#84C7AE] p-3 rounded-xl text-white mx-10
                                    hover:bg-green-400 transition duration-300'/>

                    <p className='text-center pt-2 text-xs'>Already on Socie?<br/> Click here to &nbsp;
                        <button onClick={() => navigate('/log-in')} className='hover:underline text-blue-500'>log in</button>
                        &nbsp; to your account
                    </p>
                </div>
            </div>
        </div>
    );
}

export default SignUpForm;
