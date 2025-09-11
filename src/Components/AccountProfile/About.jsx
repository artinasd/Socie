import bio from '../../assets/bio.png'
import cake from '../../assets/cake.png'
import link from '../../assets/link.png'
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';

function About() {
    const { username } = useParams();
    const users = useSelector(state => state.users);
    const selectedUser = users.find(user => user.username === username);

    return (
        <div className='bg-white rounded-xl col-span-1 mt-3 p-5 shadow-lg h-fit'>
            <h2 className='font-bold'>About</h2>

            <div className='space-y-4 mt-6'>
                <div className='flex flex-row items-start gap-3'>
                    <img className='opacity-80 w-6 mt-1' src={bio}/>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-600 leading-relaxed'>
                            {selectedUser?.bio || 'No bio added yet'}
                        </p>
                    </div>
                </div>

                <hr className='border-b-[px] border-gray-200'/>

                <div className='flex flex-row items-start gap-3'>
                    <img className='opacity-80 w-6 mt-1' src={cake}/>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-600'>
                            {selectedUser?.birthday 
                                ? new Date(selectedUser.birthday).toLocaleDateString('en-US', { 
                                    year: 'numeric', 
                                    month: 'long', 
                                    day: 'numeric' 
                                })
                                : 'No birthday added yet'
                            }
                        </p>
                    </div>
                </div>

                <hr className='border-b-[px] border-gray-200'/>

                <div className='flex flex-row items-start gap-3'>
                    <img className='opacity-80 w-6 mt-1' src={link}/>
                    <div className='flex-1'>
                        <p className='text-sm text-gray-600'>
                            {selectedUser?.location || 'No location added yet'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default About;