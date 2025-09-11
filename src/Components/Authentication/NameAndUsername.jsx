import {useState} from "react";

function NameAndUsername({nextStep, updateUserData}) {
    const [name, setName] = useState("");
    const [username, setUsername] = useState('')

    function handleSubmit() {
        updateUserData({name, username})
        nextStep()
    }

    return (
        <div className='bg-[#C1E3D6] w-screen h-screen flex items-center justify-center'>

            <div className='bg-[#F6FBF9] rounded-xl w-1/3 h-2/3 space-y-4 p-10 flex flex-col items-center'>

                <h1 className='font-bold text-3xl'>Enter Your Information</h1>
                <p className='text-center px-4 text-lg font-light'>
                    Enter your full name and choose a username that's displayed on your profile.
                </p>

                <div className='flex flex-col space-y-4 w-72'>
                    <input
                        required={true}
                        placeholder='Full Name'
                        type='text'
                        onChange={(e) => setName(e.target.value)}
                        className='p-3 rounded-xl mt-8 border border-gray-200'/>

                    <input
                        required={true}
                        placeholder='Username'
                        type='text'
                        onChange={(e) => setUsername(e.target.value)}
                        className='p-3 rounded-xl border border-gray-200'/>

                    <input
                        type='submit'
                        value='Next'
                        onClick={handleSubmit}
                        className='font-bold bg-[#84C7AE] p-3 rounded-xl text-white mx-10
                                    hover:bg-green-400 transition duration-300'/>
                </div>

            </div>

        </div>
    )
}

export default NameAndUsername;