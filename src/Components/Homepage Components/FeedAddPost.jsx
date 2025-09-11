import writePost from '../../assets/writePost.png'
import videCam from '../../assets/videoCam.png'
import photoCam from '../../assets/photoCam.png'
import gallery from '../../assets/gallery.png'
import {newUserActions} from "../../Data/newUserSlice.js";
import {useDispatch} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import {useSelector} from "react-redux";
import {useState as useStateLocal} from "react";
import ImageCropper from "../ImageCropper.jsx";
import supabase from "../../Data/supabase.js";
import {postsSliceActions} from "../../Data/postsSlice.js";

function FeedAddPost() {
    const [mediaPreviewState, setMediaPreviewState] = useState(<></>)
    const [uploadedMediaState, setUploadedMediaState] = useState('')
    const [cropper, setCropper] = useState(null)
    const [userId, setUserId] = useState(null)
    const dispatch = useDispatch()
    const descriptionRef = useRef(null)
    const reduxStateLoggedUser = useSelector((state) => state.loggedUser)

    useEffect(() => {
        if (reduxStateLoggedUser) {
            async function fetchId () {
                let {data: id, error} = await supabase
                    .from('users')
                    .select('id')
                    .eq('username', reduxStateLoggedUser)
                    .single()

                setUserId(id.id)
            }

            fetchId()
        }
    }, [reduxStateLoggedUser]);

    function handleMediaUpload(event) {
        const file = event.target.files?.[0]
        const reader = new FileReader()
        if (file) {
            reader.readAsDataURL(file)
            reader.onload = function () {
                setCropper({ src: reader.result, aspect: 1 })
            }
        }
    }

    function handleCroppedPost(base64) {
        setUploadedMediaState(base64)
        setMediaPreviewState(
            <img src={base64} className='w-20 h-20 rounded-xl opacity-80 mt-1 mr-auto'/>
        )
        setCropper(null)
    }

    async function handleAddPost() {
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {posterId: userId,
                 media: uploadedMediaState,
                 description: descriptionRef.current.value},
            ])
            .select()

        if (descriptionRef.current) {
            descriptionRef.current.value = ''
            setMediaPreviewState(<></>)
        }

        // Optimistically refresh posts in store
        try {
            let { data: posts } = await supabase.from('posts').select('*')
            let { data: users } = await supabase.from('users').select('*')
            const postAndUser = (posts || []).map(post => ({ ...post, user: users.find(u => u.id === post.posterId) }))
            dispatch(postsSliceActions.setPosts(postAndUser))
        } catch(e) {}
    }

    return (
        <div className='bg-white p-2 w-fit h-fit px-[40px] py-[20px] flex flex-col items-center mx-auto mt-6 rounded-xl shadow-2xl'>
            <div className='w-[600px] flex justify-center gap-2 mb-2'>
                <div className='bg-gray-100 bg-opacity-60 rounded-full w-[28px] h-[28px] flex items-center justify-center'>
                    <img className='w-[17px] opacity-60 pb-1' src={writePost}/>
                </div>
                <h2 className='mr-auto text-xs text-[18px] font-normal text-gray-300 mt-[5px]'>Create Post</h2>
            </div>

            <div>
                <textarea
                    ref={descriptionRef}
                    style={{scrollbarWidth: "none"}}
                    className='border border-gray-300 rounded-xl w-[600px] h-[70px] mt-2
                    focus:outline-none focus:border-gray-400 focus:h-[150px] transition-all duration-300 p-2 resize-none'>
                </textarea>
            </div>

            {mediaPreviewState}

            <div className='grid grid-cols-3 w-[600px] mt-3 text-gray-500'>
                <div className='col-span-2 flex gap-4'>
                    <button className='flex hover:bg-black hover:bg-opacity-10 transition py-1 rounded'>
                        <img className='w-6 mr-1' src={videCam}/>
                        <h2>Live Video</h2>
                    </button>

                    <button className='flex hover:bg-black hover:bg-opacity-10 transition py-1 rounded'>
                        <img className='w-6 mr-1' src={photoCam}/>
                        <h2>Feeling/Activity</h2>
                    </button>

                    <label className='flex hover:bg-black hover:bg-opacity-10 transition py-1 rounded' htmlFor='mediaPicker'>
                        <img className='w-6 mr-1' src={gallery}/>
                        <h2>Photo/Video</h2>
                    </label>
                    <input id='mediaPicker' type='file' onChange={handleMediaUpload} style={{display: 'none'}}/>
                </div>

                <div className='col-span-1 ml-auto'>
                    <button
                        onClick={handleAddPost}
                        className='bg-blue-400 rounded-full text-white px-3 py-[3px]'>Share
                    </button>
                </div>
            </div>
            {cropper && (
                <ImageCropper imageSrc={cropper.src} aspect={cropper.aspect} onCancel={() => setCropper(null)} onComplete={handleCroppedPost} />
            )}
        </div>
    )
}

export default FeedAddPost