import writePost from '../../assets/writePost.png'
import videCam from '../../assets/videoCam.png'
import photoCam from '../../assets/photoCam.png'
import gallery from '../../assets/gallery.png'
import {useDispatch, useSelector} from "react-redux";
import React, {useEffect, useRef, useState} from "react";
import ImageCropper from "../ImageCropper.jsx";
import supabase from "../../Data/supabase.js";
import {postsSliceActions} from "../../Data/postsSlice.js";

function FeedAddPost() {
    const [mediaPreviewState, setMediaPreviewState] = useState(<></>)
    const [uploadedMediaState, setUploadedMediaState] = useState('')
    const [cropper, setCropper] = useState(null)
    const [userId, setUserId] = useState(null)
    const [isSubmitting, setIsSubmitting] = useState(false)
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
                if (!error && id) {
                    setUserId(id.id)
                }
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
            <img src={base64} className='w-20 h-20 rounded-xl opacity-80 mt-2 object-cover mr-auto'/>
        )
        setCropper(null)
    }

    async function handleAddPost() {
        if (!descriptionRef.current.value.trim() && !uploadedMediaState) {
            return;
        }
        setIsSubmitting(true);
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
            setUploadedMediaState('')
        }

        try {
            let { data: posts } = await supabase.from('posts').select('*')
            let { data: users } = await supabase.from('users').select('*')
            const postAndUser = (posts || []).map(post => ({ ...post, user: users.find(u => u.id === post.posterId) }))
            dispatch(postsSliceActions.setPosts(postAndUser))
        } catch(e) {}

        setIsSubmitting(false);
    }

    return (
        <div className='bg-white p-6 w-full max-w-[680px] flex flex-col items-center mx-auto mt-6 rounded-xl shadow-lg'>
            <div className='w-full flex justify-start items-center gap-2 mb-2'>
                <div className='bg-gray-100 bg-opacity-60 rounded-full w-8 h-8 flex items-center justify-center'>
                    <img className='w-4 opacity-60' src={writePost}/>
                </div>
                <h2 className='text-gray-400 font-medium'>Create Post</h2>
            </div>

            <div className='w-full'>
                <textarea
                    ref={descriptionRef}
                    placeholder="What's on your mind?"
                    style={{scrollbarWidth: "none"}}
                    className='border border-gray-200 rounded-xl w-full h-[70px] mt-2
                    focus:outline-none focus:border-blue-300 focus:h-[120px] transition-all duration-300 p-3 resize-none bg-gray-50'>
                </textarea>
            </div>

            <div className="w-full flex justify-start">
                {mediaPreviewState}
            </div>

            <div className='flex items-center justify-between w-full mt-4 text-gray-500'>
                <div className='flex gap-4'>
                    <button className='flex items-center hover:bg-gray-100 transition px-3 py-2 rounded-lg text-sm'>
                        <img className='w-5 mr-2' src={videCam}/>
                        <span className="hidden sm:inline">Live Video</span>
                    </button>

                    <button className='flex items-center hover:bg-gray-100 transition px-3 py-2 rounded-lg text-sm'>
                        <img className='w-5 mr-2' src={photoCam}/>
                        <span className="hidden sm:inline">Feeling/Activity</span>
                    </button>

                    <label className='flex items-center hover:bg-gray-100 transition px-3 py-2 rounded-lg text-sm cursor-pointer' htmlFor='mediaPicker'>
                        <img className='w-5 mr-2' src={gallery}/>
                        <span className="hidden sm:inline">Photo/Video</span>
                    </label>
                    <input id='mediaPicker' type='file' accept="image/*" onChange={handleMediaUpload} style={{display: 'none'}}/>
                </div>

                <button
                    onClick={handleAddPost}
                    disabled={isSubmitting}
                    className={`rounded-full text-white px-6 py-2 font-medium transition-all ${isSubmitting ? 'bg-blue-300 cursor-not-allowed' : 'bg-blue-500 hover:bg-blue-600 shadow-md'}`}>
                    {isSubmitting ? 'Sharing...' : 'Share'}
                </button>
            </div>
            {cropper && (
                <ImageCropper imageSrc={cropper.src} aspect={cropper.aspect} onCancel={() => setCropper(null)} onComplete={handleCroppedPost} />
            )}
        </div>
    )
}

export default FeedAddPost