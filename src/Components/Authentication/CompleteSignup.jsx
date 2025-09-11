import React, {useRef, useState} from "react";
import plus from '../../assets/plus.png'

function SignUpForm({nextStep, updateUserData}) {
    const [base64Image, setBase64Image] = useState(null)
    const fileInputRef = useRef(null)
    const [submitButtonState, setSubmitButtonState] = useState(true)

    function handleAddButtonClick() {
        if (fileInputRef.current) {
            fileInputRef.current.click()
        }
    }

    function handleSubmit() {
        nextStep()
    }

    function handleImageUpdate(event) {
        const file = event.target.files?.[0]
        if (file) {
            const reader = new FileReader()
            reader.readAsDataURL(file)
            reader.onload = function () {
                setBase64Image(reader.result)
                setSubmitButtonState(false)
                updateUserData({pic: reader.result})
            }
        }
    }


    let content = (
        <img
            onClick={handleAddButtonClick}
            src={plus}
            className='w-48 h-[180px]'
        />
    )
    if (base64Image) {
        content = (
            <>
                {base64Image && (
                    <img
                        src={base64Image}
                        className='w-48'
                    />
                )}
            </>
        )
    }

    return (
        <div className='bg-[#C1E3D6] w-screen h-screen flex items-center justify-center'>

            <div className='bg-[#F6FBF9] rounded-xl w-1/3 h-2/3 space-y-4 p-10 flex flex-col items-center'>

                <h1 className='font-bold text-3xl text-center'>Pick A Profile Picture From Your Files</h1>
                <p className='text-center px-4 text-lg font-light'>
                    Set an image as your profile picture to represent you on Socie.
                </p>

                <input
                    type='file'
                    className=''
                    onChange={handleImageUpdate}
                    style={{display: "none"}}
                    ref={fileInputRef}
                />

                {content}

                <button
                    onClick={handleSubmit}
                    disabled={submitButtonState}
                    type='submit'
                    className='bg-green-400 text-white py-1 px-2 rounded fixed bottom-[132px] disabled:bg-gray-400'>
                    Finish Signing Up
                </button>
            </div>

        </div>
    )
}

export default SignUpForm;