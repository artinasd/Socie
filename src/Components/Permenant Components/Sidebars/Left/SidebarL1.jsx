import ic1 from '../../../../assets/SL1 (1).png'
import ic2 from '../../../../assets/SL1 (2).png'
import ic3 from '../../../../assets/SL1 (3).png'
import ic4 from '../../../../assets/SL1 (4).png'
import {useNavigate} from "react-router-dom";
import {useSelector} from "react-redux";

function SidebarL1() {
    const navigate = useNavigate();
    const reduxStateLoggedUser = useSelector((state) => state.loggedUser)

    return (
        <>
            <div className='ml-3 mt-3'>
                <div className='p-5 bg-white rounded-xl pr-24 shadow-lg w-[270px]'>
                    <h2 className='text-gray-400 text-xs font-bold'>New Feeds</h2>
                    <ul className='space-y-4 mt-4 font-bold text-gray-500'>
                        <li>
                            <button onClick={() => navigate('/')}
                                    className='flex flex-row items-center hover:text-blue-600 transition duration-500'>
                                <div className='bg-gradient-to-br from-blue-600 to-blue-400 rounded-full w-12 h-12 mr-4'>
                                    <img className='w-8 mt-2 ml-2' src={ic1}/>
                                </div>
                                Newsfeed
                            </button>
                        </li>

                        <li>
                            <button onClick={() => navigate('/suggestions')}
                                    className='flex flex-row items-center hover:text-blue-600 transition duration-500'>
                                <div className='bg-gradient-to-br from-violet-500 to-violet-300 rounded-full w-12 h-12 mr-4'>
                                    <img className='w-8 mt-2 ml-2' src={ic2}/>
                                </div>
                                Find People
                            </button>
                        </li>

                        <li>
                            <button className='flex flex-row items-center hover:text-blue-600 transition duration-500'>
                                <div className='bg-gradient-to-br from-pink-400 to-pink-300 rounded-full w-12 h-12 mr-4'>
                                    <img className='w-8 mt-2 ml-2' src={ic3}/>
                                </div>
                                Stories
                            </button>
                        </li>

                        <li>
                            <button onClick={() => navigate(`${reduxStateLoggedUser}/profile`)}
                                    className='flex flex-row items-center hover:text-blue-600 transition duration-500'>
                                <div className='bg-gradient-to-br from-cyan-600 to-cyan-400 rounded-full w-12 h-12 mr-4'>
                                    <img className='w-8 mt-2 ml-2' src={ic4}/>
                                </div>
                                Profile
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </>
    )
}

export default SidebarL1