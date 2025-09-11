function FeedStoryPreview({ profile, title, post }) {

    return (
        <>
            <div className='relative w-[130px] h-[200px] flex flex-col items-center'>
                <div className='overflow-hidden rounded-xl'>
                    <img className='h-[225px] object-cover blur-[4px]' draggable='false' src={post} />
                </div>
                <div className='absolute mt-[100px]'>
                    <div className='rounded-full border-2 border-red-400 p-[3px] aspect-square'>
                        <img className='rounded-full w-16 h-16 mx-auto shadow-gray-900 shadow-md' draggable='false' src={profile}/>
                    </div>
                    <h2 className='text-center text-white font-bold drop-shadow text-xs '>{title}</h2>
                </div>
            </div>
        </>
    )
}

export default FeedStoryPreview;