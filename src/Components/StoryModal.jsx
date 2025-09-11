function StoryModal(props) {

    if (!props.isModalOpen) {
        return null
    }

    return (
        <div className='fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90'>
            <div className='bg-white rounded-xl w-[400px] h-[700px] max-w-[90vw] max-h-[90vh] overflow-hidden'>
                {props.children}
            </div>
        </div>
    )
}

export default StoryModal