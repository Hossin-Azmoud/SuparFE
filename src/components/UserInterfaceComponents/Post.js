import { faHeart, faComment, faShare, faEllipsisVertical, faTrashCan, faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Paragraphs, Iframe } from "./microComps";
import { useSelector, useDispatch } from 'react-redux';

import { 
	DeletePost, 
	getComments, 
	getLikes, 
	Comment, 
	Like,
	unLike
} from "../../server/serverFuncs";

import { HOST } from "../../server/Var";

const Post = ({
	Userid_,
	PostId,
	UserName,
	UserImg,
	PostImg=null,
	PostText,
	NotificationFunc = () => {}
}) => {
	
	const [PostLikes, setPostLikes] = useState([]);
	const [PostComments, setPostComments] = useState([]);
	const User = useSelector(state => state.User);
	const [Liked, setLike] = useState(false);
	const [imgcmp, setImgcmp] = useState(false);
	const [ShowEdit, setShowEdit] = useState(false);
	
	const [EditPos, setEditPos] = useState({
		x: 0,
		y: 0
	});

	const [ExpandPost, setExpandPost] = useState(false);
	const [deletedflag, setdeletedflag] = useState(null); // it will be set once we delete a post successfully, substituting the content of the current post.
	const ToggleExpandPost = (e) => {
		setExpandPost(!ExpandPost);
		console.log("Got em..");
	}
	const [commentText, setCommentText] = useState("");
	const commentField = useRef(null); 
	const [rows, setRows] = useState(3);
	const countLines = (t) => t.split('\n').length;
	const onComment = (e) => setCommentText(e.target.value);
	useEffect(() => {
		setRows(countLines(commentText))
	}, [commentText])
	const Addcomment = (e) => {
		e.preventDefault()
		const temp = PostComments;

		var New = PostComments;

		const ob = {
			text: commentText,
			user: {
				UserName: User.UserName,
				img: User.img,
				id_: User.id_
			}
		}

		New.push(ob);

		setPostComments(New);

		Comment(PostId, User.id_, commentText)
		.then(r => r.json())
		.then(json => {
			if(json.code === 200) {
				// Success.
				commentField.current.value = "";
				NotificationFunc({
					text: "comment was added!",
					status: "success"
				});

			} else {
				setPostComments(temp);
				NotificationFunc({
					text: "comment was not added",
					status: "info"
				})
			}
		})

		.catch(e => {
			setPostComments(temp);
			NotificationFunc({
				text: `an error accured! ${e}`,
				status: "error"
			})
		})
	}

	const [LikeEventFlag, setLikeEventFlag] = useState(false);

	const removeLike = () => {
		const temp = PostLikes;
		var New = PostLikes.filter(s => s.uuid != User.id_);
		setPostLikes(New);

		unLike(PostId, User.id_)
		.then(r => r.json())
		.then(json => {
			
			if(json.code === 200) {
				// Success.
				console.log(PostLikes.length)
			} else {
				console.log(json.data);
				setPostLikes(temp);
				setLike(true);
			}
		})
		.catch(e => {
			console.log(e)
		})
	}

	const addLike = () => {
		const temp = PostLikes;
		var New = PostLikes;
		const ob = {
			uuid: User.id_
		}
		New.push(ob);

		setPostLikes(New)

		Like(PostId, User.id_)
		
		.then(r => r.json())
		.then(json => {
			
			if(json.code === 200) {
				// Success.
				
				// New.push(json.data)
				console.log(PostLikes.length)
			} else {
				setPostLikes(temp);
				setLike(false);
				console.log(json.data);
			}
		})
		.catch(e => {
			console.log(e)
		})
	}

	const like = () => {
		
		if(!LikeEventFlag) {
			
			setLikeEventFlag(true);
				
			if(Liked) {
				// unlike
				setLike(false);
				removeLike();
			} else {
				// like
				setLike(true);
				addLike();
			}
		}

		setLikeEventFlag(false);
	}

	const UpdateComments = () => {
		getComments(PostId)
		
		.then((r) => {
			return r.json()
		})

		.then((json) => {
			
			if(json.code === 200 ) {
				// alert(JSON.stringify(json));
				if(json.data != null) {
					var comments = json.data;
					if(HOST) {
						comments.map((v) => v.user.img = v.user.img.replace("localhost", HOST))
					}
					
					setPostComments(comments)
				}
			}
		})
		
		.catch(e => {
			console.log(e)
		})
	}

	const UpdateLikes = () => {
		
		getLikes(PostId)
		.then((r) => {
			return r.json()
		})

		.then((json) => {
			
			if(json.code === 200 ) {
				if(json.data != null) {
					setPostLikes(json.data)
				}
			}
		})
		
		.catch(e => {
			console.log(e)
		})
	}

	useEffect(() => {
		
		if(PostLikes.length > 0) {
			PostLikes.map(v => {
				if(v.uuid === User.id_) {
					setLike(true)
				}
			})
		}

		return () => setLike(false);

	}, [PostLikes]);

	useEffect(() => {
		UpdateLikes();
		UpdateComments();
		return () => {
			setPostComments([]);
			setPostLikes([]);
		}

	}, [])

	const PostOnClick = () => {
		setImgcmp({
			img: PostImg, 
			Editable: false
		});
	}

	const Delete = () => {
		DeletePost(Userid_, PostId)
		.then(response => { return response.json() })
		.then(json => {
			if(json.code === 200) { 
				setdeletedflag(true)
				
				NotificationFunc({
					text: "Post deleted successfully!!",
					status: "success"
				});

			}
			else { 
				NotificationFunc({
					text: `post Was not deleted, ${json.data}`,
					status: "info"
				});
			} 
		})
		.catch(e => {
			NotificationFunc({
				text: `warning: ${e}`,
				status: "info"
			});
		})
	}

	
	const onEditPost = (e) => {
		
		setEditPos({
			x: e.pageX - 120, 
			y: e.pageY + 30
		});

		setShowEdit(prev => !prev);
	}

	return (
		(deletedflag) ? (
			<div className="w-full flex-col items-center justify-center bg-neutral-800 my-4 rounded p-2 border border-white ">
				<p className="text-white p-2"> This post was deleted! </p>
			</div>
		) : (
		
			<div className="w-full flex-col justify-center bg-neutral-900 my-4 rounded p-2"> 
				
				{
					(imgcmp) ? (
						<Iframe Obj={{
							onclick: setImgcmp,
							variables: imgcmp
						}} />	
					) : ""	
				}

				<div className="flex flex-row items-start justify-between px-2 pt-2">
					<div className="flex flex-row items-start justify-start">
						<Link to={`/Accounts/${Userid_}`}>
							<img src={UserImg ? UserImg : "/img/defUser.jpg"} alt="user avatar" className="rounded-md w-10 h-10" />
						</Link>
						<span className="ml-4">
							<h5 className="font-semibold text-base text-sky-100"> { UserName } </h5>
							<h5 className="font-thin text-sm text-green-700 "> #{ Userid_ } </h5>
						</span>	
					</div>
					{
						(User.id_ === Userid_) ? (
							<>
								<Fa icon={faEllipsisVertical} title="edit post." className="transition-all cursor-pointer text-white" onClick={onEditPost}/>
						
								<div className={`text-white border border-yellow shadow-xl bg-black p-2 rounded absolute ${(ShowEdit) ? "flex flex-col" : "hidden"}`} style={{
									top: `${EditPos.y}px`,
									left: `${EditPos.x}px`
								}}>
									<button className="hover:bg-sky-700 my-1 bg-sky-800 p-1" onClick={Delete}>
										<span> Delete </span> <Fa icon={faTrashCan} className="transition-all cursor-pointer text-white ml-6"/> 
									</button>
								</div>
							</>
						) : ""
					}
				</div>
				
				<main className="p-2">
					{
						(PostText) ? (
							<Paragraphs Text={PostText} Class="text-white my-2" />
						) : ""
					}
					
					<img 
						src={PostImg} alt="pImage" 
						className={(PostImg) ? "my-4 w-full h-full visible rounded" : "hidden"} 
						onClick={PostOnClick}
					/>

				</main>

				<div className="pl-2 pb-2 flex flex-row items-center justify-start">

					<div className="flex flex-row items-center justify-start rounded shadow-2xl">
						<Fa icon={ faHeart } className={`cursor-pointer transition-all ${(Liked) ? "text-rose-700" : "text-white"}`} size="lg" onClick={like}/>
						<span className="font-base text-slate-400 ml-2"> { PostLikes.length } </span>
					</div>
					
					<div className="ml-5 flex flex-row items-center justify-start rounded shadow-2xl">
						<Fa icon={ faComment } className="cursor-pointer transition-all text-white" size="lg" onClick={ToggleExpandPost}/>
						<span className="font-thin text-white ml-2"> { PostComments.length } </span>
					</div>

					<div className="ml-5 flex flex-row items-center justify-start rounded shadow-2xl">
						<Fa icon={ faShare } className="cursor-pointer transition-all text-white" size="lg" />
						<span className="font-thin text-white ml-2"> 0 </span>
					</div>

				</div>
				
				{
					(ExpandPost) ? (
					
					<div className="fixed flex-col md:flex-row top-0 left-0 w-screen bg-black flex overflow-y-scroll h-screen">
						{/* TODO: new feature => comments and post expandation  onClick. */}
						<section className="hidden md:flex items-center justify-center bg-black-400 sm:w-[60%] h-full w-full">

							<main className="py-2 px-4 bg-neutral-900 w-[60%] rounded shadow-xl">
								<div className="flex flex-row items-start justify-start">
								
									<Link to={`/Accounts/${Userid_}`}>
										<img src={UserImg ? UserImg : "/img/defUser.jpg"} alt="user avatar" className="rounded-full w-10 h-10" />
									</Link>
									<span className="ml-2">
										<h5 className="font-semibold text-base text-sky-100"> { UserName } </h5>
										<h5 className="font-thin text-sm text-green-700 "> #{ Userid_ } </h5>
									</span>	
								
								</div>
							
								{
									(PostText) ? (
										<Paragraphs Text={PostText} Class="text-white my-5" />
									) : ""
								}
								
								<img 
									src={PostImg} alt="user avatar" 
									className={(PostImg) ? "my-4 w-full h-full visible rounded" : "hidden"} 
									onClick={PostOnClick}
								/>

								<div className="mt-5 pb-2 flex flex-row items-center justify-start">

									<div className="flex flex-row items-center justify-start hover:bg-sky-400  bg-neutral-800 p-2 rounded shadow-2xl cursor-pointer" onClick={like}>
										<Fa icon={ faHeart } className={`transition-all ${(Liked) ? "text-rose-700" : "text-white"}`} size="lg" />
										<span className="font-thin text-white ml-5"> { PostLikes.length } </span>
									</div>
								</div>
							</main>
						</section> {/* Div to hold the post. */}
						
						<section className="flex items-start justify-center bg-black p-6 sm:w-[40%] h-full w-full overflow-y-scroll">
							{/* map the comments to this section if there is any. */}
							
							<button className="fixed flex justify-center items-center top-4 w-10 hover:ring rounded-full h-10 p-2 bg-neutral-800 left-4" onClick={ToggleExpandPost}>
								<Fa icon={faClose} className="text-white" size="xl" />
							</button>

							<div className="p-3 flex flex-col justify-center items-start">
								<textarea cols="81" rows={rows + 1} ref={commentField} onChange={onComment} className="NoBar my-3 rounded-md w-full focus:border-sky-700 border-neutral-700 border resize-none p-3 text-white bg-none px-2 outline-none bg-black p-2" type="text" placeholder="say something" /> 

			                	<div className="flex flex-row items-center justify-center mt-2">
									<button onClick={Addcomment} title="Send post" className="text-white p-2 hover:bg-sky-500 bg-sky-600 rounded">
					              		comment
					              	</button>
			                	</div>


			                	{
			                		(PostComments.length > 0) ? (
			                			
			                				PostComments.map((v, i) => {
			                					return (
			                						<div key={i} className="bg-neutral-900 w-full my-4 px-2 rounded-md py-4">
								                		<div className="flex flex-row justify-start items-start">
								                			<Link to={`/Accounts/${v.user.id_}`}>
																<img src={v.user.img ? v.user.img : "/img/defUser.jpg"} alt="user avatar" className="rounded-md w-10 h-10 shadow" />
															</Link>

															<span className="ml-4">
																<h5 className="font-semibold text-base text-sky-100"> { v.user.UserName } </h5>
																<h5 className="font-thin text-sm text-green-700 "> #{ v.user.id_ } </h5>
															</span>
								                		</div>
								                		
			                							<p className="ml-1 mt-4 text-white"> { v.text } </p>	
			                						</div>
			                					)
			                				})			                			
			                		) : ""
			                	}

							</div>
						</section> {/* Div to hold the comments. */}
					</div>) : ""
				}
				

			</div>
		)
	)
}



export default Post;


