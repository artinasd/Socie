import { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { api } from "../Data/api.js";

function PostCards({ userPic, name, username, content, image, id }) {
	const navigate = useNavigate();
	const loggedUser = useSelector((state) => state.loggedUserData);
	const [likes, setLikes] = useState([]);
	const [comments, setComments] = useState([]);
	const [isLiked, setIsLiked] = useState(false);
	const [showComments, setShowComments] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const commentRef = useRef();

	useEffect(() => {
		async function fetchInteractions() {
			const { data: fetchedLikes } = await api.get(`/likes/${id}`);
			const { data: fetchedComments } = await api.get(`/comments/${id}`);

			if (fetchedLikes) {
				setLikes(fetchedLikes);
				if (loggedUser) {
					setIsLiked(fetchedLikes.some(like => like.userId === loggedUser.id));
				}
			}
			if (fetchedComments) {
				setComments(fetchedComments);
			}
		}
		fetchInteractions();
	}, [id, loggedUser]);

	async function handleLike() {
		if (!loggedUser) return navigate('/sign-up');

		if (isLiked) {
			await api.delete('/likes', { postId: id, userId: loggedUser.id });
			setLikes(prev => prev.filter(l => l.userId !== loggedUser.id));
			setIsLiked(false);
		} else {
			await api.post('/likes', { postId: id, userId: loggedUser.id });
			setLikes(prev => [...prev, { postId: id, userId: loggedUser.id }]);
			setIsLiked(true);
		}
	}

	async function handleAddComment(e) {
		e.preventDefault();
		const text = commentRef.current.value.trim();
		if (!text || !loggedUser) return;

		setIsSubmitting(true);
		const { data, error } = await api.post('/comments', {
			postId: id,
			userId: loggedUser.id,
			content: text
		});

		if (!error && data) {
			setComments(prev => [data, ...prev]);
			commentRef.current.value = '';
		}
		setIsSubmitting(false);
	}

	return (
		<div className='bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-[680px] w-full mx-auto my-4 transition hover:shadow-md'>
			<div className='flex items-center gap-3 mb-4'>
				<img
					onClick={() => navigate(`/${username}/profile`)}
					className='w-12 h-12 rounded-full object-cover cursor-pointer hover:opacity-80 transition'
					src={userPic}
					alt={name}
				/>
				<div>
					<h3 onClick={() => navigate(`/${username}/profile`)} className='font-bold text-gray-800 cursor-pointer hover:underline'>{name}</h3>
					<p className='text-sm text-gray-500'>@{username}</p>
				</div>
			</div>

			{content && (
				<p className='text-gray-700 mb-4 whitespace-pre-wrap break-words leading-relaxed'>
					{content}
				</p>
			)}

			{image && (
				<div className="w-full rounded-xl overflow-hidden mb-4 bg-gray-50 flex justify-center">
					<img className='max-h-[500px] object-contain' src={image} alt="Post media" />
				</div>
			)}

			<div className='flex items-center gap-6 pt-4 border-t border-gray-100 text-gray-500 font-medium'>
				<button onClick={handleLike} className={`flex items-center gap-2 transition ${isLiked ? 'text-red-500' : 'hover:text-red-500'}`}>
					<span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
					{likes.length} Likes
				</button>
				<button onClick={() => setShowComments(!showComments)} className='flex items-center gap-2 hover:text-blue-500 transition'>
					<span className="text-xl">💬</span>
					{comments.length} Comments
				</button>
			</div>

			{showComments && (
				<div className="mt-4 pt-4 border-t border-gray-100">
					{loggedUser && (
						<form onSubmit={handleAddComment} className="flex gap-2 mb-4">
							<input
								ref={commentRef}
								type="text"
								placeholder="Write a comment..."
								className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-100"
							/>
							<button disabled={isSubmitting} type="submit" className="text-blue-500 font-bold px-3 text-sm disabled:opacity-50 hover:underline">
								Post
							</button>
						</form>
					)}
					<ul className="space-y-3 max-h-48 overflow-y-auto" style={{scrollbarWidth: 'none'}}>
						{comments.map((comment) => (
							<li key={comment.id} className="bg-gray-50 p-3 rounded-lg text-sm break-words">
								<span className="font-bold mr-2 text-gray-700">User_{comment.userId}:</span>
								<span className="text-gray-600">{comment.content}</span>
							</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}

export default PostCards;