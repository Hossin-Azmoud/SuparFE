import { faHeart, faComment, faShare, faEllipsisVertical, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Paragraphs, Iframe } from "./microComps";
import { useSelector, useDispatch } from 'react-redux';
import { DeletePost } from "../Util/serverFuncs";

const Post = ({

	Userid_,
	PostId,
	UserName,
	UserImg,
	PostImg=null,
	PostText,
	NotificationFunc = () => {}

}) => {

	const User = useSelector(state => state.User);
	const [Liked, SetLike] = useState(false);
	const [imgcmp, setImgcmp] = useState(false);
	const [ShowEdit, setShowEdit] = useState(false);
	
	const [EditPos, setEditPos] = useState({
		x: 0,
		y: 0
	});
	const [deletedflag, setdeletedflag] = useState(null); // it will be set once we delete a post successfully, substituting the content of the current post.

	const like = () => {
		SetLike(!Liked);
	}

	// TODO: Add likes, comments to db.
	const AddLikeById = () => {
		// TODO
	}

	const addComment = () => {
		//TODO
	}

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
		const box = e.target.getBoundingClientRect()
		setShowEdit(prev => !prev);
		setEditPos({
			x: box.x - 120, 
			y: box.y + 30
		});
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
							<img src={UserImg ? UserImg : "/img/defUser.jpg"} alt="user avatar" className="rounded-full w-10 h-10" />
						</Link>
						<span className="ml-2">
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
					// The content of the 
					{
						(PostText) ? (
							<Paragraphs Text={PostText} Class="text-white my-2" />
						) : ""
					}
					<img 
						src={PostImg} alt="user avatar" 
						className={(PostImg) ? "my-4 w-full h-full visible rounded" : "hidden"} 
						onClick={PostOnClick}
					/>
				</main>

				<div className="pl-2 pb-2 flex flex-row items-center justify-start">

					<div className="flex flex-row items-center justify-start">
						<Fa icon={ faHeart } className={`transition-all cursor-pointer ${(Liked) ? "text-rose-700" : "text-white"}`} onClick={like} size="lg" />
						<span className="mx-2 font-thin font-mono text-white"> 0 </span>
					</div>
					<div className="flex flex-row items-center justify-start">
						<Fa icon={ faComment } className="transition-all cursor-pointer mx-5 text-white" size="lg" />
						<span className="mx-2 font-thin font-mono text-white"> 0 </span>
					</div>
					<div className="flex flex-row items-center justify-start">
						<Fa icon={ faShare } className="transition-all cursor-pointer text-white" size="lg" />
						<span className="mx-2 font-thin font-mono text-white"> 0 </span>
					</div>
				</div>

			</div>
		)
	)
}

export default Post;
