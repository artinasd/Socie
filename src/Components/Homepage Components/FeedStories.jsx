import FeedStoryPreview from "../UI Costume Elements/FeedStoryPreview.jsx";
import addSgn from '../../assets/addSgn.jpg'
import {useRef, useState, useEffect} from "react";
import ImageCropper from "../ImageCropper.jsx";
import {useSelector} from "react-redux";
import loadingGif from "../../assets/loading.gif"
import { api } from "../../Data/api.js"

function FeedStories(props) {
    const [storyList, setStoryList] = useState([])
    const [uploadedStory, setUploadedStory] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [cropper, setCropper] = useState(null)
    const fileInputRef = useRef(null)

    const scrollContainerRef = useRef(null);

    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const loggedUser = useSelector(state => state.loggedUserData)
    const initialAllUsers = useSelector(state => state.users)

    useEffect(() => {
        if (initialAllUsers !== null) {
            fetchStories();
        }
    }, [initialAllUsers]);

    if (!loggedUser) {
        return <></>
    }

    if (initialAllUsers === null) {
        return <img src={loadingGif} className='w-10 mx-auto mt-6 opacity-50' alt="Loading..." />
    }

    const handleMouseDown = (e) => {
        isDragging.current = true;
        startX.current = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        scrollLeft.current = scrollContainerRef.current?.scrollLeft || 0;
    };

    const handleMouseMove = (e) => {
        if (!isDragging.current) return;
        e.preventDefault();
        const x = e.pageX - (scrollContainerRef.current?.offsetLeft || 0);
        const walk = x - startX.current;
        if (scrollContainerRef.current) {
            scrollContainerRef.current.scrollLeft = scrollLeft.current - walk;
        }
    };

    const handleMouseUp = () => {
        isDragging.current = false;
    };

    async function handleAddStory(e) {
        const file = e.target.files?.[0]
        if (!file || !loggedUser) return;

        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        setIsUploading(true);

        const reader = new FileReader();
        reader.onload = () => {
            const base64 = reader.result;
            setCropper({ src: base64, aspect: 400/700 })
        }
        reader.readAsDataURL(file)
    }

    async function handleCroppedStory(croppedBase64) {
        setUploadedStory(croppedBase64)
        setCropper(null)
        try {
            const { error } = await api.post('/stories', {
                user_id: loggedUser.id,
                media_url: croppedBase64,
                expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
            });

            if (error) {
                console.error('Database error:', error);
                alert('Failed to upload story: ' + error.message);
                return;
            }
            await fetchStories();
        } catch (error) {
            console.error('Error uploading story:', error);
        } finally {
            setIsUploading(false);
            setUploadedStory(null);
            if (fileInputRef.current) {
                fileInputRef.current.value = '';
            }
        }
    }

    async function fetchStories() {
        if (!initialAllUsers || initialAllUsers.length === 0) return;

        try {
            const { data: stories, error } = await api.get('/stories');

            if (error || !stories || stories.length === 0) {
                setStoryList([]);
                return;
            }

            const activeStories = stories.filter(s => new Date(s.expires_at) > new Date());

            const storiesWithUsers = activeStories.map(story => {
                const user = initialAllUsers.find(u => u.id === story.user_id);
                return {
                    ...story,
                    user: user || { id: story.user_id, username: 'Unknown', name: 'Unknown User', pic: '' }
                };
            });

            const storiesByUser = storiesWithUsers.reduce((acc, story) => {
                const userId = story.user_id;
                if (!acc[userId]) {
                    acc[userId] = { user: story.user, stories: [] };
                }
                acc[userId].stories.push(story);
                return acc;
            }, {});

            setStoryList(Object.values(storiesByUser));
        } catch (error) {
            setStoryList([]);
        }
    }

    function handleViewStory(storyData) {
        props.onViewStory(storyData);
    }

    return (
        <>
            <div className='mx-auto max-w-[680px] w-full pt-8'>
                <ul ref={scrollContainerRef}
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    onMouseLeave={handleMouseUp}
                    className='flex flex-row items-center gap-3 overflow-x-scroll select-none pb-2 cursor-grab active:cursor-grabbing'
                    style={{scrollbarWidth: 'none'}}>
                    <li className="shrink-0">
                        <div onClick={() => !isUploading && fileInputRef.current.click()} className="cursor-pointer">
                            <FeedStoryPreview
                                profile={addSgn}
                                title={isUploading ? 'Uploading...' : 'Add Story'}
                                post={uploadedStory || (loggedUser ? loggedUser.pic : '')}
                            />
                        </div>
                        <input
                            type='file'
                            ref={fileInputRef}
                            style={{display: "none"}}
                            onChange={handleAddStory}
                            accept="image/*"
                            disabled={isUploading}
                        />
                    </li>
                    {storyList.map((storyData) => (
                        <li key={storyData.user.id} onClick={() => handleViewStory(storyData)} className="shrink-0 cursor-pointer transition transform hover:scale-[1.02]">
                            <FeedStoryPreview
                                profile={storyData.user.pic}
                                title={storyData.user.username}
                                post={storyData.stories[0]?.media_url || storyData.user.pic}
                            />
                        </li>
                    ))}
                </ul>
            </div>
            {cropper && (
                <ImageCropper imageSrc={cropper.src} aspect={cropper.aspect} onCancel={() => { setIsUploading(false); setCropper(null) }} onComplete={handleCroppedStory} />
            )}
        </>
    )
}

export default FeedStories;