import ic1 from '../../../../assets/SL2 (1).png'
import ic2 from '../../../../assets/SL2 (2).png'
import ic3 from '../../../../assets/SL2 (3).png'
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

function SidebarL1() {
    const navigate = useNavigate()
    const loggedUsername = useSelector(state => state.loggedUser)

    return (
        <>
            <div className='ml-3 mt-3'>
                <div className='p-5 bg-white rounded-xl pr-24 shadow-lg w-[270px]'>
                    <h2 className='text-gray-400 text-xs font-bold'>Account</h2>
                    <ul className='space-y-4 mt-4 font-bold text-gray-500'>
                        <li>
                            <button className='flex flex-row items-center hover:text-blue-600 transition duration-500'>
                                <img className='w-8 mr-4 opacity-60' src={ic1}/>
                                Chats
                            </button>
                        </li>

                        <li>
                            <button className='flex flex-row items-center hover:text-blue-600 transition duration-500'>
                                <img className='w-8 mr-4 opacity-60' src={ic2}/>
                                Analytics
                            </button>
                        </li>

                        <li>
                            <button
                                onClick={() => {
                                    if (loggedUsername) {
                                        navigate(`/${loggedUsername}/profile`, { state: { openSettings: true } })
                                    }
                                }}
                                className='flex flex-row items-center hover:text-blue-600 transition duration-500'>
                                <img className='w-8 mr-4 opacity-60' src={ic3}/>
                                Settings
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default SidebarL1