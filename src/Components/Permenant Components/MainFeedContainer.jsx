import FeedAddPost from "../Homepage Components/FeedAddPost.jsx";
import FeedStories from "../Homepage Components/FeedStories.jsx";
import FeedPosts from "../Homepage Components/FeedPosts.jsx";
import {useSelector} from "react-redux";
import StoryModal from '../StoryModal.jsx'
import StoryViewer from '../StoryViewer.jsx'
import {useState} from "react";

function MainFeedContainer() {
    const loggedUser = useSelector(redux => redux.loggedUser)
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedStoryData, setSelectedStoryData] = useState(null);

    function handleShowStory(storyData) {
        setSelectedStoryData(storyData);
        setIsModalOpen(true);
    }

    function handleCloseStory() {
        setIsModalOpen(false);
        setSelectedStoryData(null);
    }

    function handleNextStory() {
        // For now, just close the modal
        // In a full implementation, you'd navigate to the next user's story
        handleCloseStory();
    }

    function handlePreviousStory() {
        // For now, just close the modal
        // In a full implementation, you'd navigate to the previous user's story
        handleCloseStory();
    }

    return (
        <div className='col-span-2'>
            <FeedStories onViewStory={handleShowStory} />
            {loggedUser && <FeedAddPost />}
            <FeedPosts />

            <StoryModal isModalOpen={isModalOpen}>
                {selectedStoryData ? (
                    <StoryViewer
                        storyData={selectedStoryData}
                        onClose={handleCloseStory}
                        onNext={handleNextStory}
                        onPrevious={handlePreviousStory}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-gray-500">No story selected</p>
                    </div>
                )}
            </StoryModal>
        </div>
    )
}

export default MainFeedContainer;