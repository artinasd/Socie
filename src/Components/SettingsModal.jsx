import { useState, useEffect, useRef } from 'react';
import ImageCropper from './ImageCropper.jsx'
import { useSelector, useDispatch } from 'react-redux';
import supabase from '../Data/supabase.js';
import { loggedUserDataSliceActions } from '../Data/loggedUserDataSlice.js';

function SettingsModal({ isOpen, onClose }) {
    const [bio, setBio] = useState('');
    const [birthday, setBirthday] = useState('');
    const [location, setLocation] = useState('');
    const [headerPic, setHeaderPic] = useState('');
    const [headerPreview, setHeaderPreview] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isPrivate, setIsPrivate] = useState(false);
    const [favoritesInput, setFavoritesInput] = useState('')
    const [favorites, setFavorites] = useState([])
    const loggedUser = useSelector(state => state.loggedUserData);
    const dispatch = useDispatch();
    const fileInputRef = useRef(null);
    const [headerCropper, setHeaderCropper] = useState(null)

    // Load current profile data when modal opens
    useEffect(() => {
        if (isOpen && loggedUser) {
            setBio(loggedUser.bio || '');
            setBirthday(loggedUser.birthday || '');
            setLocation(loggedUser.location || '');
            setHeaderPic(loggedUser.header_pic || '');
            setHeaderPreview(loggedUser.header_pic || '');
            setIsPrivate(!!loggedUser.private);
            setFavorites(Array.isArray(loggedUser.favorites) ? loggedUser.favorites : [])
            setFavoritesInput('')
        }
    }, [isOpen, loggedUser]);

    const handleHeaderUpload = (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {
            const base64Data = event.target.result;
            // Open cropper with banner-like aspect (e.g., 3:1)
            setHeaderCropper({ src: base64Data, aspect: 3/1 })
        };
        reader.readAsDataURL(file);
    };

    const handleRemoveHeader = () => {
        setHeaderPic('');
        setHeaderPreview('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    function handleCroppedHeader(base64) {
        setHeaderPic(base63Safe(base64))
        setHeaderPreview(base63Safe(base64))
        setHeaderCropper(null)
    }

    function base63Safe(data) {
        return data
    }

    const handleSave = async () => {
        if (!loggedUser) return;
        
        setIsSaving(true);
        try {
            const updateData = {
                bio: bio.trim(),
                birthday: birthday.trim(),
                location: location.trim(),
                header_pic: headerPic,
                private: isPrivate,
                favorites
            };

            const { error } = await supabase
                .from('users')
                .update(updateData)
                .eq('id', loggedUser.id);

            if (error) {
                console.error('Error updating profile:', error);
                alert('Failed to save profile: ' + error.message);
                return;
            }

            // Update the logged user data in Redux
            dispatch(loggedUserDataSliceActions.updateProfile(updateData));
            
            // Force full refresh to ensure header image reflects everywhere immediately
            window.location.reload();
        } catch (error) {
            console.error('Error saving profile:', error);
            alert('Failed to save profile: ' + error.message);
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setBio(loggedUser?.bio || '');
        setBirthday(loggedUser?.birthday || '');
        setLocation(loggedUser?.location || '');
        setHeaderPic(loggedUser?.header_pic || '');
        setHeaderPreview(loggedUser?.header_pic || '');
        setIsPrivate(!!loggedUser?.private);
        setFavorites(Array.isArray(loggedUser?.favorites) ? loggedUser.favorites : [])
        setFavoritesInput('')
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        onClose();
    };

    if (!isOpen) return null;

    return (
        <>
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-xl w-[500px] max-w-[90vw] p-6 shadow-2xl max-h-[90vh] overflow-y-auto" style={{scrollbarWidth: 'thin'}}>
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold">Settings</h2>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-black transition-colors text-xl"
                    >
                        ✕
                    </button>
                </div>

                <div className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Privacy
                        </label>
                        <div className="flex items-center gap-3">
                            <button
                                type="button"
                                onClick={() => setIsPrivate(prev => !prev)}
                                className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${isPrivate ? 'bg-[#84C7AE]' : 'bg-gray-300'}`}
                                disabled={isSaving}
                            >
                                <span
                                    className={`absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white transition-all duration-300 ${isPrivate ? 'left-6' : 'left-1'}`}
                                />
                            </button>
                            <span className="text-sm text-gray-600">Private account</span>
                        </div>
                        <p className="text-xs text-gray-400 mt-1">When private, people must send follow requests to see your posts and stories.</p>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Favorites (tags)
                        </label>
                        <div className='flex gap-2'>
                            <input
                                value={favoritesInput}
                                onChange={(e) => setFavoritesInput(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault()
                                        const t = favoritesInput.trim()
                                        if (t && !favorites.includes(t)) setFavorites(prev => [...prev, t])
                                        setFavoritesInput('')
                                    }
                                }}
                                placeholder='Add a tag and press Enter'
                                className='flex-1 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-gray-400 transition-all'
                                disabled={isSaving}
                            />
                            <button type='button' onClick={() => { const t = favoritesInput.trim(); if (t && !favorites.includes(t)) setFavorites(prev => [...prev, t]); setFavoritesInput('') }} disabled={isSaving} className='px-4 py-2 rounded-xl bg-[#84C7AE] text-white hover:bg-green-400 disabled:opacity-50'>Add</button>
                        </div>
                        {favorites.length > 0 && (
                            <ul className='flex flex-wrap gap-2 mt-3'>
                                {favorites.map(tag => (
                                    <li key={tag} className='px-2 py-1 text-xs bg-gray-100 rounded-full border border-gray-200 flex items-center gap-1'>
                                        <span>#{tag}</span>
                                        <button type='button' onClick={() => setFavorites(prev => prev.filter(t => t !== tag))} className='text-gray-500 hover:text-black'>×</button>
                                    </li>
                                ))}
                            </ul>
                        )}
                        <p className='text-xs text-gray-400 mt-1'>Used to improve Suggestions.</p>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Header Picture
                        </label>
                        <div className="space-y-3">
                            {headerPreview && (
                                <div className="relative">
                                    <img 
                                        src={headerPreview} 
                                        alt="Header preview" 
                                        className="w-full h-32 object-cover rounded-xl border border-gray-200"
                                    />
                                    <button
                                        onClick={handleRemoveHeader}
                                        className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                                    >
                                        ✕
                                    </button>
                                </div>
                            )}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => fileInputRef.current?.click()}
                                    disabled={isSaving}
                                    className="px-4 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                                >
                                    {headerPreview ? 'Change Header' : 'Add Header'}
                                </button>
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    onChange={handleHeaderUpload}
                                    className="hidden"
                                    disabled={isSaving}
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-2">
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            value={bio}
                            onChange={(e) => setBio(e.target.value)}
                            placeholder="Tell us about yourself..."
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400 transition-all duration-300 resize-none"
                            rows={4}
                            maxLength={150}
                            disabled={isSaving}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {bio.length}/150 characters
                        </p>
                    </div>

                    <div>
                        <label htmlFor="birthday" className="block text-sm font-medium text-gray-700 mb-2">
                            Birthday
                        </label>
                        <input
                            type="date"
                            id="birthday"
                            value={birthday}
                            onChange={(e) => setBirthday(e.target.value)}
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400 transition-all duration-300"
                            disabled={isSaving}
                        />
                    </div>

                    <div>
                        <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                            Location
                        </label>
                        <input
                            type="text"
                            id="location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            placeholder="City, Country"
                            className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-gray-400 transition-all duration-300"
                            maxLength={50}
                            disabled={isSaving}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            {location.length}/50 characters
                        </p>
                    </div>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={handleCancel}
                            disabled={isSaving}
                            className="px-6 py-2 border border-gray-300 rounded-xl text-gray-700 hover:bg-gray-50 transition-all duration-300 disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            disabled={isSaving}
                            className={`px-6 py-2 rounded-xl text-white font-medium transition-all duration-300 ${
                                isSaving 
                                    ? 'bg-gray-400 cursor-not-allowed' 
                                    : 'bg-[#84C7AE] hover:bg-green-400 hover:shadow-md'
                            }`}
                        >
                            {isSaving ? 'Saving...' : 'Save'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
        {headerCropper && (
            <ImageCropper imageSrc={headerCropper.src} aspect={headerCropper.aspect} onCancel={() => setHeaderCropper(null)} onComplete={handleCroppedHeader} />
        )}
        </>
    );
}

export default SettingsModal;
