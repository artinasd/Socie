import { useState } from "react";
import SignUpForm from "./SignUpForm.jsx";
import CompleteSignup from "./CompleteSignup.jsx";
import NameAndUsername from "./NameAndUsername.jsx";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { loggedUserActions } from "../../Data/loggedInUserSlice.js";
import supabase from "../../Data/supabase.js";

function SingUpFlow() {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [step, setStep] = useState(1);
    const [userData, setUserData] = useState({
        name: '',
        username: '',
        email: '',
        password: '',
        pic: '',
        posts: {
            stories: [],
            feed: []
        },
        connections: {followings: [], followers: []}
    });

    function nextStep() {
        setStep((prevState) => prevState + 1);
    }

    function updateUserData(newData) {
        setUserData((prevState) => ({ ...prevState, ...newData }));
    }

    async function handleFinishSignUp() {
        try {
            const { data, error } = await supabase
                .from('users')
                .insert([
                    {
                        name: userData.name,
                        username: userData.username,
                        email: userData.email,
                        password: userData.password,
                        pic: userData.pic
                    },
                ])
                .select()

            if (error) {
                console.error("Error creating user:", error);
                alert("Error creating user: " + error.message);
                return;
            }

            dispatch(loggedUserActions.setLoggedUser(userData.username));
            navigate(`/${userData.username}/profile`);
        }
        catch (err) {
            console.error("Unexpected error creating user:", err);
            alert("Unexpected error: " + err.message);
        }
    }

    return (
        <>
            {step === 1 && (<SignUpForm nextStep={nextStep} updateUserData={updateUserData} />)}
            {step === 2 && (<NameAndUsername nextStep={nextStep} updateUserData={updateUserData} />)}
            {step === 3 && (<CompleteSignup nextStep={handleFinishSignUp} updateUserData={updateUserData} />)}
        </>
    );
}

export default SingUpFlow;