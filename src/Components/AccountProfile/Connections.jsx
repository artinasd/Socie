import SuggestedAccountCard from "../Permenant Components/Sidebars/Right/SuggestedAccountCard.jsx";

function Connections({componentTitle, usersToMap}) {

    let content = (
        <ul className='p-2'>
            {usersToMap.map((eachConnection, index) => (
                <li key={index}>
                    <SuggestedAccountCard username={eachConnection.username} name={eachConnection.name} image={eachConnection.pic}/>
                </li>
            ))}
        </ul>
    )

    if (usersToMap.length === 0) {
        content = <p className='text-center text-sm text-gray-600 py-5'>No interactions yet!</p>
    }

    return (
        <div className="bg-white rounded-xl col-span-1 mt-3 shadow-lg h-fit">
            <h2 className="font-bold pt-5 px-5">{componentTitle}</h2>

            {content}
        </div>
    )
}

export default Connections;