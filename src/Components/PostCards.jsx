import {useSelector, useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import supabase from "../Data/supabase.js";
import loadingGIF from "../assets/loading.gif"

function PostCards({image, profile, name, description, style, username, postId}) {
	const navigate = useNavigate()
	const dispatch = useDispatch()
	const loggedUser = useSelector(redux => redux.loggedUser)
	const [loggedUserSate, setLoggedUserState] = useState(null)
	const [loggedUserId, setLoggedUserId] = useState(null)
	const [loggedUserObj, setLoggedUserObj] = useState(null)
	const [likeCount, setLikeCount] = useState(0)
	const [isLiked, setIsLiked] = useState(false)
	const [isLikeBusy, setIsLikeBusy] = useState(false)
	const [commentCount, setCommentCount] = useState(0)
	const [isCommentsOpen, setIsCommentsOpen] = useState(false)
	const [comments, setComments] = useState([])
	const [isCommentsLoading, setIsCommentsLoading] = useState(false)
	const [newComment, setNewComment] = useState("")
	const [isCommentBusy, setIsCommentBusy] = useState(false)
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const [removeButtonPlaceholder, setRemoveButtonPlaceholder] = useState('Remove')

	useEffect(() => {
		if (loggedUser) {
			async function fetchLoggedUser() {
				let { data: user, error } = await supabase
					.from('users')
					.select('*')
					.eq('username', loggedUser)
					.single()

				if (!error && user) {
					setLoggedUserState(user.username)
					setLoggedUserId(user.id)
					setLoggedUserObj(user)
				}
			}

			fetchLoggedUser()
		}
	}, []);

	useEffect(() => {
		async function fetchLikesAndComments() {
			if (!postId) return;
			// Likes count
			const { count: likesCount } = await supabase
				.from('likes')
				.select('*', { count: 'exact', head: true })
				.eq('postId', postId)

			setLikeCount(likesCount || 0)

			// Whether current user liked
			if (loggedUserId) {
				const { data: myLike } = await supabase
					.from('likes')
					.select('id')
					.eq('postId', postId)
					.eq('userId', loggedUserId)
					.maybeSingle()

				setIsLiked(!!myLike)
			}

			// Comments count
			const { count: commentsCount } = await supabase
				.from('comments')
				.select('*', { count: 'exact', head: true })
				.eq('postId', postId)

			setCommentCount(commentsCount || 0)
		}

		fetchLikesAndComments()
	}, [postId, loggedUserId]);

	async function toggleLike() {
		if (!loggedUserId || !postId || isLikeBusy) return;
		setIsLikeBusy(true)
		try {
			if (isLiked) {
				await supabase
					.from('likes')
					.delete()
					.eq('postId', postId)
					.eq('userId', loggedUserId)
				setIsLiked(false)
				setLikeCount(prev => Math.max(0, (prev || 0) - 1))
			} else {
				await supabase
					.from('likes')
					.insert([{ postId, userId: loggedUserId }])
				setIsLiked(true)
				setLikeCount(prev => (prev || 0) + 1)
			}
		} finally {
			setIsLikeBusy(false)
		}
	}

	async function openComments() {
		if (!postId) return;
		setIsCommentsOpen(true)
		setIsCommentsLoading(true)
		// Fetch comments without joins
		const { data: rawComments } = await supabase
			.from('comments')
			.select('id, content, created_at, userId')
			.eq('postId', postId)
			.order('created_at', { ascending: false })
		const commentsList = rawComments || []
		// Fetch unique users referenced by comments
		const commenterIds = Array.from(new Set(commentsList.map(c => c.userId).filter(Boolean)))
		let usersMap = {}
		if (commenterIds.length > 0) {
			const { data: usersData } = await supabase
				.from('users')
				.select('id, username, name, pic')
				.in('id', commenterIds)
			usersMap = (usersData || []).reduce((acc, u) => { acc[u.id] = u; return acc }, {})
		}
		const merged = commentsList.map(c => ({ ...c, user: usersMap[c.userId] }))
		setComments(merged)
		setIsCommentsLoading(false)
	}

	async function submitComment(e) {
		e?.preventDefault?.()
		if (!newComment.trim() || !loggedUserId || !postId || isCommentBusy) return;
		setIsCommentBusy(true)
		try {
			const { data, error } = await supabase
				.from('comments')
				.insert([{ postId, userId: loggedUserId, content: newComment.trim() }])
				.select('id, content, created_at, userId')
				.single()
			if (!error && data) {
				const enriched = { ...data, user: loggedUserObj }
				setComments(prev => [enriched, ...prev])
				setCommentCount(prev => (prev || 0) + 1)
				setNewComment("")
			}
		} finally {
			setIsCommentBusy(false)
		}
	}

	async function handleDeletePost(postId) {
		const { error } = await supabase
			.from('posts')
			.delete()
			.eq('id', postId)

		setRemoveButtonPlaceholder(<img src={loadingGIF} className='w-4' />)
		try {
			let { data: posts } = await supabase.from('posts').select('*')
			let { data: users } = await supabase.from('users').select('*')
			const postAndUser = (posts || []).map(post => ({ ...post, user: users.find(u => u.id === post.posterId) }))
			const { postsSliceActions } = await import("../Data/postsSlice.js")
			dispatch(postsSliceActions.setPosts(postAndUser))
		} catch(e) {}
	}

	return (
		<>
			<div className={`bg-white rounded-xl px-10 pt-10 pb-2 ${style} h-fit shadow-2xl mb-6`}>

				<div className='flex flex-row items-center mb-4'>
					<img className='rounded-full w-16 mr-4 h-16 drop-shadow' src={profile}/>

					<div className='flex-col'>
						<h2 className='font-bold'>
							<button onClick={() => navigate(`/${posterUser}/profile`)}>{name}</button>
						</h2>
						<p className='font-light text-gray-500'>2 hours ago</p>
					</div>

					{username === loggedUserSate ?
						<div className='ml-auto mb-auto right-0 flex flex-col items-center'>
							<button
									onClick={() => setIsMenuOpen(!isMenuOpen)}
									className='text-2xl text-gray-600 hover:text-black transition'>
								...
							</button>

							{isMenuOpen &&(
								<menu className='bg-[#FCFCFC] absolute rounded-lg border border-gray-200 px-4 mt-8 text-center py-1 text-gray-600'>
									<li><button className='hover:text-black transition'>Edit</button></li>
									<div className='-mx-4 my-1'>
										<hr className='border-t border-gray-200' />
									</div>
									<li>
										<button
										onClick={() => handleDeletePost(postId)}
										className='hover:text-black transition'>
											{removeButtonPlaceholder}
										</button>
									</li>
								</menu>
							)}
						</div>
						: null}
				</div>

				<p>{description}</p>

				<img className='py-2 rounded-xl' src={image}/>

				<div className='flex items-center justify-between mt-4 mb-2'>
					<p className='text-xs'>{likeCount} Likes · {commentCount} Comments</p>
					<div className='flex items-center gap-4'>
						<button
							className={`text-sm ${isLiked ? 'text-red-500' : 'text-gray-600 text-xl'} hover:text-black transition`}
							onClick={toggleLike}
							disabled={isLikeBusy}
						>
							{isLiked ? 'Unlike' : '𖹭'}
						</button>
						<button
							className='text-sm text-gray-600 text-xl hover:text-black transition'
							onClick={openComments}
						>
							✎
						</button>
					</div>
				</div>
			</div>

			{isCommentsOpen && (
				<div className='fixed inset-0 bg-black/30 flex items-center justify-center z-50'>
					<div className='bg-white rounded-xl w-[600px] max-w-[90vw] p-6 shadow-2xl'>
						<div className='flex justify-between items-center mb-4'>
							<h3 className='font-semibold'>Comments</h3>
							<button className='text-gray-500 hover:text-black' onClick={() => setIsCommentsOpen(false)}>✕</button>
						</div>
						<form onSubmit={submitComment} className='flex gap-2 mb-4'>
							<input
								type='text'
								value={newComment}
								onChange={e => setNewComment(e.target.value)}
								placeholder='Add a comment...'
								className='flex-1 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:border-gray-400 transition-all duration-300'
								disabled={isCommentBusy}
							/>
							<button 
								type='submit' 
								disabled={isCommentBusy || !newComment.trim()} 
								className={`px-4 py-2 rounded-xl text-white font-medium transition-all duration-300 ${
									isCommentBusy || !newComment.trim() 
										? 'bg-gray-400 cursor-not-allowed' 
										: 'bg-[#84C7AE] hover:bg-green-400 hover:shadow-md'
								}`}
							>
								{isCommentBusy ? 'Posting...' : 'Post'}
							</button>
						</form>
						<div className='max-h-[300px] overflow-y-auto'>
							{isCommentsLoading ? (
								<p className='text-sm text-gray-500'>Loading...</p>
							) : comments.length === 0 ? (
								<p className='text-sm text-gray-500'>No comments yet.</p>
							) : (
								<ul className='space-y-3'>
									{comments.map(c => (
										<li key={c.id} className='text-sm'>
											<div className='flex items-start gap-3'>
												<button onClick={() => { setIsCommentsOpen(false); navigate(`/${c.user?.username}/profile`) }}>
													<img src={c.user?.pic} alt={c.user?.name} className='w-8 h-8 rounded-full'/>
												</button>
												<div>
													<button onClick={() => { setIsCommentsOpen(false); navigate(`/${c.user?.username}/profile`) }} className='font-medium hover:underline'>
														{c.user?.name || c.user?.username}
													</button>
													<p className='text-gray-900'>{c.content}</p>
													<p className='text-[11px] text-gray-500'>{new Date(c.created_at).toLocaleString()}</p>
												</div>
											</div>
										</li>) )}
								</ul>
							)}
						</div>
					</div>
				</div>
			)}
		</>
	)
}

export default PostCards;