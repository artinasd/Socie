import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import { createPortal } from 'react-dom'

function AccountCards({image, name, username, matches}) {
    const navigate = useNavigate()
    const cardRef = useRef(null)
    const [showHint, setShowHint] = useState(false)
    const [hintPos, setHintPos] = useState(null)

    const hintText = (() => {
        if (!matches || matches.length === 0) return ''
        const primary = matches[0]
        const more = Math.max(0, matches.length - 1)
        return `Interested in #${primary} just like you${more > 0 ? ` (+${more} more)` : ''}!`
    })()

    useEffect(() => {
        if (hintText && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect()
            setHintPos({ top: rect.top + window.scrollY, left: rect.left + window.scrollX - 8 })
            setShowHint(true)
            const t = setTimeout(() => setShowHint(false), 7000)
            return () => clearTimeout(t)
        }
    }, [hintText])

    return (
        <div className='relative bg-white rounded p-4 flex flex-col items-center space-y-2 w-52 h-52 shadow col-span-1' ref={cardRef}>

            <button className='flex flex-col items-center space-y-2 mt-1' onClick={() => navigate(`/${username}/profile`)}>
                <img className='rounded-full w-16 h-16' src={image}/>
                <h2>{name}</h2>
                <p className='text-gray-400 text-xs'>@{username}</p>
            </button>
            <button className='bg-[#00DB7F] rounded-full p-2 px-3 text-white hover:bg-green-300 transition-all'>
                + Follow
            </button>

            {hintText && showHint && hintPos && createPortal(
                (
                    <div style={{ position: 'absolute', top: hintPos.top + 'px', left: hintPos.left + 'px' }} className='z-[9999]'>
                        <div className='relative -translate-x-full'>
                            <div className='bg-[#FA6A6B] text-white shadow-2xl rounded-xl px-3 py-2 max-w-[240px] text-[11px] animate-pulse'>
                                {hintText}
                            </div>
                            <div className='absolute top-3 -right-1 w-2 h-2 bg-[#FA6A6B] rotate-45'></div>
                        </div>
                    </div>
                ),
                document.body
            )}

        </div>
    )
}

export default AccountCards;