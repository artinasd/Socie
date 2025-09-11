import {useCallback, useEffect, useState} from 'react'
import Cropper from 'react-easy-crop'

function ImageCropper({ imageSrc, aspect = 1, onCancel, onComplete }) {
    const [crop, setCrop] = useState({ x: 0, y: 0 })
    const [zoom, setZoom] = useState(1)
    const [croppedAreaPixels, setCroppedAreaPixels] = useState(null)

    const onCropComplete = useCallback((_, croppedPixels) => {
        setCroppedAreaPixels(croppedPixels)
    }, [])

    async function getCroppedImg(imageSrc, crop) {
        const image = await new Promise((resolve, reject) => {
            const img = new Image()
            img.onload = () => resolve(img)
            img.onerror = reject
            img.src = imageSrc
        })

        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')

        canvas.width = crop.width
        canvas.height = crop.height

        ctx.drawImage(
            image,
            crop.x,
            crop.y,
            crop.width,
            crop.height,
            0,
            0,
            crop.width,
            crop.height
        )

        return canvas.toDataURL('image/jpeg', 0.9)
    }

    const handleDone = useCallback(async () => {
        if (!croppedAreaPixels) return
        const result = await getCroppedImg(imageSrc, croppedAreaPixels)
        onComplete?.(result)
    }, [croppedAreaPixels, imageSrc, onComplete])

    return (
        <div className='fixed inset-0 bg-black/70 z-[9999] flex items-center justify-center'>
            <div className='bg-white rounded-xl w-[90vw] max-w-[520px] h-[80vh] max-h-[720px] shadow-2xl flex flex-col'>
                <div className='relative flex-1'>
                    <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={aspect}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                    />
                </div>
                <div className='p-3 flex items-center gap-3 border-t'>
                    <input type='range' min={1} max={3} step={0.1} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} className='flex-1'/>
                    <button onClick={onCancel} className='px-4 py-2 rounded-lg border'>Cancel</button>
                    <button onClick={handleDone} className='px-4 py-2 rounded-lg bg-[#84C7AE] text-white'>Crop</button>
                </div>
            </div>
        </div>
    )
}

export default ImageCropper


