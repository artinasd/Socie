import FeedStoryPreview from "../UI Costume Elements/FeedStoryPreview.jsx";
import addSgn from '../../assets/addSgn.jpg'
import {useRef, useState, useEffect} from "react";
import ImageCropper from "../ImageCropper.jsx";
import {useSelector} from "react-redux";
import loadingGif from "../../assets/loading.gif"
import supabase from "../../Data/supabase.js"

function FeedStories(props) {
    const [storyList, setStoryList] = useState([])
    const [uploadedStory, setUploadedStory] = useState(null)
    const [isUploading, setIsUploading] = useState(false)
    const [selectedStory, setSelectedStory] = useState(null)
    const [cropper, setCropper] = useState(null)
    const fileInputRef = useRef(null)

    const scrollContainerRef = useRef(null);

    // Drag Scroll Handlers
    const isDragging = useRef(false);
    const startX = useRef(0);
    const scrollLeft = useRef(0);

    const loggedUser = useSelector(state => state.loggedUserData)
    const initialAllUsers = useSelector(state => state.users)

    // Debug logging
    useEffect(() => {
        console.log('FeedStories - loggedUser:', loggedUser);
        console.log('FeedStories - initialAllUsers:', initialAllUsers);
    }, [loggedUser, initialAllUsers]);

    // Fetch stories for all users
    useEffect(() => {
        fetchStories();
    }, [initialAllUsers]);

    if (!loggedUser) {
        return <></>
    }

    if (initialAllUsers.length === 0) {
        return <img src={loadingGif} className='w-10 mx-auto mt-6' />
    }
    const allUsers = initialAllUsers.filter(user => user.id !== loggedUser.id)

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

    // Function to resize image to story dimensions
    function resizeImageForStory(file, callback) {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        const img = new Image();
        
        img.onload = function() {
            // Story viewer dimensions (400px width, 700px height)
            const targetWidth = 400;
            const targetHeight = 700;
            
            // Set canvas to exact story viewer dimensions
            canvas.width = targetWidth;
            canvas.height = targetHeight;
            
            // Calculate scaling to fill the entire canvas (like object-cover)
            const scaleX = targetWidth / img.width;
            const scaleY = targetHeight / img.height;
            const scale = Math.max(scaleX, scaleY); // Use max to fill entire canvas
            
            // Calculate centered position
            const scaledWidth = img.width * scale;
            const scaledHeight = img.height * scale;
            const x = (targetWidth - scaledWidth) / 2;
            const y = (targetHeight - scaledHeight) / 2;
            
            // Draw scaled and centered image
            ctx.drawImage(img, x, y, scaledWidth, scaledHeight);
            
            // Convert to base64
            const resizedBase64 = canvas.toDataURL('image/jpeg', 0.8);
            callback(resizedBase64);
        };
        
        img.src = URL.createObjectURL(file);
    }

    async function handleAddStory(e) {
        const file = e.target.files?.[0]
        if (!file) {
            console.log('No file selected');
            return;
        }
        
        if (!loggedUser) {
            console.log('No logged user found');
            return;
        }
        
        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }
        
        console.log('Uploading story for user:', loggedUser);
        setIsUploading(true);

        // Read file as base64 then open cropper (aspect matches viewer 400x700)
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
                console.log('Inserting story into database...');
                // Upload story to database
                const { data, error } = await supabase
                    .from('stories')
                    .insert([{
                        user_id: loggedUser.id,
                        media_url: croppedBase64,
                        expires_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString() // 24 hours from now
                    }])
                    .select()
                    .single();

                if (error) {
                    console.error('Database error:', error);
                    if (error.message.includes('relation "stories" does not exist')) {
                        alert('Stories table not found. Please create the stories table in your database first. Check the console for the SQL command.');
                        console.log('=== CREATE STORIES TABLE ===');
                        console.log(`CREATE TABLE stories (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  media_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '24 hours'),
  views_count INTEGER DEFAULT 0
);

CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_expires_at ON stories(expires_at);`);
                    } else {
                        alert('Failed to upload story: ' + error.message);
                    }
                    return;
                }

                console.log('Story uploaded successfully:', data);
                
                // Refresh stories list
                await fetchStories();
                
            } catch (error) {
                console.error('Error uploading story:', error);
                alert('Failed to upload story: ' + error.message);
            } finally {
                setIsUploading(false);
                setUploadedStory(null);
                // Reset file input
                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }
    }

    // Extract fetchStories function for reuse
    async function fetchStories() {
        if (!initialAllUsers.length) return;
        
        try {
            // First, try to fetch stories without the join
            const { data: stories, error } = await supabase
                .from('stories')
                .select('*')
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false });

            if (error) {
                console.error('Error fetching stories:', error);
                // If stories table doesn't exist, show empty list
                setStoryList([]);
                return;
            }

            if (stories && stories.length > 0) {
                // Manually join with users data
                const storiesWithUsers = stories.map(story => {
                    const user = initialAllUsers.find(u => u.id === story.user_id);
                    return {
                        ...story,
                        user: user || { id: story.user_id, username: 'Unknown', name: 'Unknown User', pic: '' }
                    };
                });

                // Group stories by user
                const storiesByUser = storiesWithUsers.reduce((acc, story) => {
                    const userId = story.user_id;
                    if (!acc[userId]) {
                        acc[userId] = {
                            user: story.user,
                            stories: []
                        };
                    }
                    acc[userId].stories.push(story);
                    return acc;
                }, {});
                
                setStoryList(Object.values(storiesByUser));
                console.log('Stories fetched:', Object.values(storiesByUser));
            } else {
                setStoryList([]);
                console.log('No stories found');
            }
        } catch (error) {
            console.error('Error fetching stories:', error);
            setStoryList([]);
        }
    }

    function handleViewStory(storyData) {
        setSelectedStory(storyData);
        props.onViewStory(storyData);
    }

    return (
        <>
        <div className='mx-auto w-[680px] pt-12'>
            <ul ref={scrollContainerRef}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
                className='flex flex-row items-center gap-2 overflow-x-scroll select-none'
                style={{scrollbarWidth: 'none'}}>
                <li>
                    <div onClick={() => !isUploading && fileInputRef.current.click()}>
                        <FeedStoryPreview 
                            profile={addSgn} 
                            title={isUploading ? 'Uploading...' : 'Add To Your Story'} 
                            post={uploadedStory || (loggedUser ? loggedUser.pic : '')} 
                        />
                    </div>
                    <input 
                        type='file' 
                        ref={fileInputRef} 
                        style={{display: "none"}} 
                        onChange={handleAddStory}
                        accept="image/*,video/*"
                        disabled={isUploading}
                    />
                </li>
                {storyList.map((storyData) => (
                    <li key={storyData.user.id} onClick={() => handleViewStory(storyData)}>
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