import { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import { api } from '../Data/api.js';

function StoryViewer({ storyData, onClose, onNext, onPrevious }) {
    const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
    const [isPlaying, setIsPlaying] = useState(true);
    const [progress, setProgress] = useState(0);
    const loggedUser = useSelector(state => state.loggedUserData);
    const progressRef = useRef(null);
    const intervalRef = useRef(null);

    const currentStory = storyData?.stories[currentStoryIndex];
    const totalStories = storyData?.stories.length || 0;

    useEffect(() => {
        if (!isPlaying || !currentStory) return;

        const duration = 5000;
        const interval = 50;
        let elapsed = 0;

        intervalRef.current = setInterval(() => {
            elapsed += interval;
            const newProgress = (elapsed / duration) * 100;
            setProgress(newProgress);

            if (elapsed >= duration) {
                handleNext();
            }
        }, interval);

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [currentStoryIndex, isPlaying, currentStory]);

    useEffect(() => {
        if (currentStory && loggedUser && currentStory.user_id !== loggedUser.id) {
            api.put(`/stories/${currentStory.id}`, { views_count: (currentStory.views_count || 0) + 1 });
        }
    }, [currentStory, loggedUser]);

    const handleNext = () => {
        if (currentStoryIndex < totalStories - 1) {
            setCurrentStoryIndex(prev => prev + 1);
            setProgress(0);
        } else {
            onNext?.();
        }
    };

    const handlePrevious = () => {
        if (currentStoryIndex > 0) {
            setCurrentStoryIndex(prev => prev - 1);
            setProgress(0);
        } else {
            onPrevious?.();
        }
    };

    const handlePause = () => {
        setIsPlaying(!isPlaying);
        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }
    };

    const handleProgressClick = (e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const clickX = e.clientX - rect.left;
        const percentage = (clickX / rect.width) * 100;
        setProgress(percentage);

        const duration = 5000;
        const newElapsed = (percentage / 100) * duration;

        if (intervalRef.current) {
            clearInterval(intervalRef.current);
        }

        let elapsed = newElapsed;
        intervalRef.current = setInterval(() => {
            elapsed += 50;
            const newProgress = (elapsed / duration) * 100;
            setProgress(newProgress);

            if (elapsed >= duration) {
                handleNext();
            }
        }, 50);
    };

    if (!storyData || !currentStory) {
        return null;
    }

    return (
        <div className="relative w-full h-full bg-black rounded-xl overflow-hidden">
            <div className="relative w-full h-full">
                {currentStory.media_url.startsWith('data:video') ? (
                    <video
                        src={currentStory.media_url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        onPause={() => setIsPlaying(false)}
                        onPlay={() => setIsPlaying(true)}
                    />
                ) : (
                    <img
                        src={currentStory.media_url}
                        alt="Story"
                        className="w-full h-full object-cover"
                    />
                )}
            </div>

            <div className="absolute top-4 left-4 right-4 flex gap-1">
                {storyData.stories.map((_, index) => (
                    <div
                        key={index}
                        className="flex-1 h-1 bg-black bg-opacity-40 rounded-full overflow-hidden cursor-pointer shadow-lg backdrop-blur-sm"
                        onClick={handleProgressClick}
                    >
                        <div
                            className="h-full bg-white rounded-full transition-all duration-75 shadow-sm"
                            style={{
                                width: index < currentStoryIndex
                                    ? '100%'
                                    : index === currentStoryIndex
                                        ? `${progress}%`
                                        : '0%'
                            }}
                        />
                    </div>
                ))}
            </div>

            <div className="absolute top-4 left-4 right-4 flex items-center justify-between text-white">
                <div className="flex items-center gap-3 bg-black bg-opacity-30 rounded-full px-3 py-2 backdrop-blur-sm shadow-lg">
                    <img
                        src={storyData.user.pic}
                        alt={storyData.user.name}
                        className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    />
                    <div>
                        <p className="font-semibold text-sm drop-shadow-sm">{storyData.user.name}</p>
                        <p className="text-xs opacity-90 drop-shadow-sm">
                            {new Date(currentStory.created_at).toLocaleTimeString([], {
                                hour: '2-digit',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="text-white hover:text-gray-300 transition-colors bg-black bg-opacity-30 rounded-full w-8 h-8 flex items-center justify-center backdrop-blur-sm shadow-lg"
                >
                    ✕
                </button>
            </div>

            <div className="absolute inset-0 flex">
                <div
                    className="w-1/2 h-full cursor-pointer"
                    onClick={handlePrevious}
                />
                <div
                    className="w-1/2 h-full cursor-pointer"
                    onClick={handleNext}
                />
            </div>

            <button
                onClick={handlePause}
                className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white bg-black bg-opacity-60 rounded-full p-2 hover:bg-opacity-80 transition-all shadow-lg backdrop-blur-sm"
            >
                {isPlaying ? '⏸️' : '▶️'}
            </button>

            <div className="absolute bottom-4 right-4 text-white text-sm bg-black bg-opacity-60 px-3 py-2 rounded-full shadow-lg backdrop-blur-sm">
                {currentStoryIndex + 1} / {totalStories}
            </div>
        </div>
    );
}

export default StoryViewer;