import { faImage, faHeart, faComment, faEdit, faShare, faEllipsisVertical, faTrashCan, faClose, faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import { Paragraphs, Iframe } from "./microComps";
import { useSelector, useDispatch } from 'react-redux';
import { CommentPannel as CommentPannelUI } from "./commentPannel";
import { UserDisplay } from "./UserUI";

import {
	getPostById,
	DeletePost, 
	getComments, 
	getLikes, 
	Comment, 
	Like,
	unLike,
	NewPost
} from "../server/serverFuncs";
import { convertBase64 } from "../server/functions";
import { timeAgo } from "../Util/time";

const Post = ({
	Userid_,
	PostId,
	UserName,
	UserImg,
	PostImg=null,
	PostText,
	NotificationFunc = () => {},
	CreatedDate = new Date(),
	expanded = false,
	PostLikesProp,
	PostCommentsProp,
	PostEventDispatcher = (action, payload) => console.log(action, "\n", payload)
}) => {

	/* 
	TODO:
		EventFuncs = {
			'remove': () => {
				# signal to the UI that the post was deleted.
			},
			'RemComment': (State) => {
				# signal to the UI that a comment was removed.
			},
			'RemLike': () => {
				# signal to the UI that a like was removed.
			},
			'AddComment': (State) => {
				# signal to the UI that a comment was added.
			},
			'AddLike': () => {
				# signal to the UI that a like was added.
			}
		}
		
		PostEventDispatcher = () => {
			...
		}
		
		# Dispatch an event with an action and a payload to use...
		PostEventDispatcher = (action, payload) => EventFuncs[action](payload);

	*/

	const [PostLikes, setPostLikes] = useState(PostLikesProp);
	const [PostComments, setPostComments] = useState(PostCommentsProp);
	const User = useSelector(state => state.User);
	const [Liked, setLike] = useState(false);
	const [imgcmp, setImgcmp] = useState(false);
	const [ShowEdit, setShowEdit] = useState(false);
	const [LikeEventFlag, setLikeEventFlag] = useState(false);
	
	const [EditPos, setEditPos] = useState({
		x: 0,
		y: 0
	})

	const [ExpandPost, setExpandPost] = useState(expanded);
	const [deletedflag, setdeletedflag] = useState(null); // it will be set once we delete a post successfully, substituting the content of the current post.

	const ToggleExpandPost = (e) => setExpandPost(!ExpandPost)

	const removeLike = () => {
		
		const temp = PostLikes;
		var New = PostLikes.filter(s => s.uuid != User.id_);		
		setPostLikes(New);	
		
		unLike(PostId, User.id_)
		.then(r => r.json())
		.then(json => {
			if(json.code !== 200) {
				// failed.
				setPostLikes(temp);
				setLike(true);
			} else {
				PostEventDispatcher('RemLike', User.id_);
			}
		})
		.catch(e => {
			console.log(e)
		})
	}

	const addLike = () => {
		const old = PostLikes;
		var New = PostLikes;
		
		const ob = {
			uuid: User.id_
		}

		New.push(ob);

		setPostLikes(New)

		Like(PostId, User.id_, Userid_)
		
		.then(r => r.json())
		.then(json => {
			
			if(json.code !== 200) {
				// Failed.
				setPostLikes(old);
				setLike(false);
			} else {
				// PostEventDispatcher('AddLike', User.id_);
				console.log(json);
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

	useEffect(() => {

		if(PostLikes.length > 0) {
			PostLikes.map(v => {
				if(v.uuid === User.id_) {
					setLike(true)
				}
			})
		}
		
		return () => {
			setPostComments([]);
			setPostLikes([]);
			setLike(false);
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
				})
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
			})
		})
	}
	
	const onEditPost = (e) => {
		
		setEditPos({
			x: e.pageX - 120, 
			y: e.pageY
		});

		setShowEdit(prev => !prev);
	}

	return (
		(deletedflag) ? (
			<div className="md:w-[80%] w-full flex-col items-center justify-center bg-neutral-800 my-4 mx-auto rounded p-2 border border-neutral-700">
				<p className="text-white p-2"> This post was deleted! </p>
			</div>
		) : (
		
			<div className="md:w-[80%] w-full mx-auto flex-col justify-center bg-neutral-900 my-4 rounded p-2 border border-neutral-700"> 
				
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
								<Fa size="sm" icon={faEllipsisVertical} title="edit post." className="transition-all cursor-pointer text-white" onClick={onEditPost}/>
						
								<div className={`text-white shadow-xl bg-neutral-800 px-4 rounded absolute ${(ShowEdit) ? "flex flex-col" : "hidden"}`} style={{
									top: `${EditPos.y}px`,
									left: `${EditPos.x}px`
								}}>
									<button className="flex flex-row justify-between items-center my-1 hover:underline cursor-pointer" title="delete the post" onClick={Delete}>
										<span> Delete </span> 
										<Fa icon={faTrashCan} className="ml-4 transition-all text-white" size="sm"/> 
									</button>
									
									<button className="flex flex-row justify-between items-center my-1 hover:underline cursor-pointer" title="edit the post" onClick={Delete}>
										<span> Edit </span> 
										<Fa icon={ faEdit } className="ml-4 transition-all text-white" size="sm"/> 
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

				<div className="pl-2 pb-2 flex flex-row items-center justify-between px-2">
				
					<div className="flex flex-row items-center justify-start">
						<div className="flex flex-row items-center justify-start rounded shadow-2xl">
							<Fa icon={ faHeart } className={`cursor-pointer transition-all ${(Liked) ? "text-rose-700" : "text-white"}`} size="sm" onClick={like}/>
							<span className="font-base text-slate-400 ml-2"> { PostLikes.length } </span>
						</div>
						
						<div className="ml-5 flex flex-row items-center justify-start rounded shadow-2xl">
							<Fa icon={ faComment } className="cursor-pointer transition-all text-white" size="sm" onClick={ToggleExpandPost}/>
							<span className="font-thin text-white ml-2"> { PostComments.length } </span>
						</div>

						<div className="ml-5 flex flex-row items-center justify-start rounded shadow-2xl">
							<Fa icon={ faShare } className="cursor-pointer transition-all text-white" size="sm" />
							<span className="font-thin text-white ml-2"> 0 </span>
						</div>
					</div>

					<p className="flex flex-row items-center justify-center rounded shadow-2xl text-sm text-slate-500"> { timeAgo.format(new Date(CreatedDate)) } </p>
				</div>

				
				{
					(ExpandPost) ? (
						<ExpandedPostUI
							User={User}
							uuid={Userid_}
							UName={UserName}
							UImg={UserImg}
							postObject={{
								text: PostText,
								img: PostImg,
								pid: PostId
							}}
							PostImageOnclick={PostOnClick}
							PostOnlike={like}
							Comments={PostComments}
							SetComments={setPostComments}
							Likes={PostLikes}
							Liked={Liked}
							NotificationFunc={NotificationFunc}
							Close={(!expanded) ? ToggleExpandPost : null}
						/>
					) : ""
				}

			</div>
		)
	)
}

const ExpandedPostUI = ({
	User,
	uuid,
	UName,
	UImg,
	postObject,
	PostImageOnclick,
	PostOnlike,
	Comments,
	SetComments,
	Likes,
	Liked,
	NotificationFunc = () => {},
	Close = null
}) => {
	return (
	<div className="fixed sm:overflow-hidden overflow-y-scroll flex-col justify-center items-center sm:flex-row top-0 left-0 w-screen bg-black flex h-screen z-50">
		{/* TODO: new feature => comments and post expandation  onClick. */}
		<section className="flex border blue-shadow border-neutral-900 flex-col items-center justify-center w-[85%] sm:w-[60%] sm:h-full">
		
			{
				(postObject.img) ? (
					<img src={ postObject.img } className="w-[80%] sm:w-[70%] border border-neutral-900"/> 
				) : ""
			}
			

			<div className="w-full sm:w-[70%] pb-2 flex flex-col items-start justify-start bg-neutral-900 p-2 shadow-xl rounded-b">
					
					<div className="flex flex-row items-center justify-between shadow-2xl w-full cursor-pointer" onClick={PostOnlike}>
						
						<UserDisplay Userid_={uuid} UserName={UName} UserImg={UImg} />

					</div>
					{
						(postObject.text) ? (
							<Paragraphs Text={postObject.text} Class="w-full text-white mt-2" />
						) : ""
					}

					<span className="font-thin text-white mt-2"> 
						<Fa icon={ faHeart } className={`transition-all mr-3 ${(Liked) ? "text-rose-700" : "text-white"}`} size="lg" />
						{ Likes.length }
					</span>
			</div>

		</section>
		
		{
			(Close) ? (
				<button className="fixed flex justify-center items-center bottom-4 w-10 hover:ring rounded-full h-10 p-2 bg-neutral-800 right-4" onClick={Close}>
					<Fa icon={faClose} className="text-white" size="xl" />
				</button>
			) : ""
		}

		<CommentPannelUI
			Comments={ Comments } 
			setComments={ SetComments }
			postObject={ postObject }
			User={ User }
			uuid={ uuid }
			NotificationFunc={ NotificationFunc }
		/>

	</div>
)
}

const PostPage = ({ NotificationFunc }) => {
	let { id } = useParams();
	const [PostObj, setPost] = useState(null)
	const [IsLoading, setLoading] = useState(true)
	
	useEffect(() => {
		if(!IsLoading) setLoading(true);
		var tmp = {};
		getPostById(id)
		.then(r => r.json())
		.then(json => {
			if(json.code === 200) {
				tmp = json.data
			}
		})
		.finally(() => {
			setPost({...tmp})
			setLoading(false);
			console.log(tmp);
		})
		.catch((e) => console.log(e));

		return () => {
			setPost(null);
		}

	}, [])
	
	return (
		(PostObj && !IsLoading) ? (
			<Post 
				Userid_={PostObj.uuid}
				PostId={PostObj.id}
				UserName={PostObj.user.UserName}
				UserImg={PostObj.user.img}
				PostImg={PostObj.img}
				PostText={PostObj.text}
				CreatedDate={PostObj.date}
				NotificationFunc={NotificationFunc}
				PostLikesProp={(PostObj.post_likes) ? PostObj.post_likes : []}
				PostCommentsProp={(PostObj.post_comments) ? PostObj.post_comments : []}
				expanded={ true }
			/>
		) : ""
	)
}

const PostFormUI = ({ AddNewPost, NotificationFunc }) => {
	
	const User = useSelector(state => state.User);
	const [rows, setRows] = useState(3);
	const [Image, setImage] = useState(null);
	const [Text, setText] = useState("");
	const textField = useRef(null)
	const [state, setState] = useState({});
	const countLines = (t) => t.split('\n').length;
	const resetAll = (New) => {
		setImage(null);
		setText("");
		// Fixed.
		AddNewPost(New);
		setState({});
		textField.current.value = "";
	}

	useEffect(() => {
		// TODO count lines in the Text, then set row/line number.
		if(Text) {
			setRows(countLines(Text));
		}

		setState({
			uuid: User.id_,
			img: Image,
			text: Text
		});

	}, [Image, Text]);	

	const OnTypingText = (e) => {
		setText(e.target.value);
	}

	const OpenFileDialogue = (e) => {
		e.preventDefault();
		document.getElementById("image").click()
	};

	const OnImageSelected = (e) => {
		const Files = e.target.files;
		if(Files.length === 1) {
			convertBase64(Files[0])
			.then((Data) => {
				setImage(Data);	
			})
		} else if (Files.length > 1) {
			const FilesData = [];
			for (let i = 0; i < Files.length; i++) {
				convertBase64(Files[i])
				.then((Data) => {
					FilesData.push(Data);	
				})
			}
			setImage(FilesData);
		} else {
			NotificationFunc({
				text: "No images were selected!",
				status: "info"
			});
		}
	}

	const OnSubmit = (e) => {
		
		e.preventDefault();
		if(state.text || state.img) {
			NewPost(state)
			.then((r) => r.json())
			.then((Json) => {
				if(Json.code === 200) {
					NotificationFunc({
						text: "Post added!",
						status: "success"
					});
					var New = state;
					
					New.post_comments = [];
					New.post_likes = [];

					New.comments_count = 0;
					New.likes_count = 0;

					New.id = Json.data;
					New.user = User;
					
					resetAll(New); // TODO this is fishy !!

				} else {
					console.log(Json);
					NotificationFunc({
						text: "Could not add your post, " + Json.data,
						status: "error"
					});
				}
			}).catch((e) => {
				
				console.log(e);
				NotificationFunc({
					text: "could not add post due to a technical problem, please try again later.",
					status: "error"
				});

			})
		}

		return;
	}


	return (
		<form className="mx-auto border border-slate-900 mt-2 flex rounded p-2 flex-col justify-center items-start my-2 w-full md:w-[80%]  transition-all">
					
			<input type="file" id="image" className="hidden" onChange={OnImageSelected}/>
        	<textarea cols="81" rows={rows} ref={textField} onChange={OnTypingText} className="NoBar w-full focus:border-b-sky-700 border-b-neutral-700 border-b resize-none p-3 text-white bg-none px-2 outline-none bg-black p-2" type="text" placeholder="say something" /> 
        	
        	<div className="flex flex-col bg-neutral-900 p-2 rounded-md mt-2 w-full">
              	<div className="flex w-full flex-row items-center justify-between">
              		<Link to='/profile' className="flex flex-row items-start justify-start">
	               	    <img src={User.img} alt="avatar" className="w-10 h-10 rounded-full shadow-2xl"/>
	              	</Link>

	              	<div className="flex items-center justify-center">
	              		<Fa onClick={OpenFileDialogue} icon={faImage} size="sm" 
	              			className="transition-all ease-in-out mx-2 cursor-pointer text-white rounded-full hover:bg-sky-600 p-2" />
						<button onClick={OnSubmit} title="Send post" className="text-white py-1 px-2 hover:bg-sky-500 bg-sky-600 rounded">
		              		<p className=""> post </p>
		              	</button>
	              	</div>
              	</div>

              	{ (Image) ? (<img src={Image} className="rounded-md my-2 w-full" alt='imgUploaded' />) : "" }

        	</div>
    	</form>
	)
}


const FloatingPostFormUI = ({
	
	isOpenFlag = false,
	setPosts,
	NotificationFunc

}) => {

	//TODO: floating form handler. if someone wants to post something from across the app, they may??
	
	// 1. Make the UI. --
	// 2. Update a posts mechanism so we prevent calling the database again for data. --
	// 3. Integrate the UI. --

	const [isOpen, setIsOpen] = useState(isOpenFlag);
	const Close = () => setIsOpen(false)
	const Open = () => setIsOpen(true)

	return (	
		(isOpen) ? (
			<>
				<div className="fixed w-screen h-screen left-0 top-0 bg-black opacity-50" onClick={Close}>
				</div>

				<div className="w-[90%] sm:w-[600px] border border-neutral-900 fixed bg-black -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2 rounded p-2">
					<Fa icon={ faClose } className="h-4 w-4 cursor-pointer flex justify-center items-center hover:ring rounded-full right-4 bg-sky-500 rounded-full p-2 text-white" size="sm" onClick={Close}/>
					<PostFormUI 
						setPosts={setPosts} 
						NotificationFunc={NotificationFunc}
					/>
				</div>
			</>
			
			
		) : <Fa title="Add post" icon={ faAdd } className="bg-sky-500 cursor-pointer p-2 text-white rounded fixed bottom-16 right-4" size="2xl" onClick={Open}/>
	)
}

export { PostPage, PostFormUI, FloatingPostFormUI };
export default Post;