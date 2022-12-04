import { faHeart, faComment, faShare, faEllipsisVertical, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Paragraphs, Iframe } from "./microComps";
import { useSelector, useDispatch } from 'react-redux';

const Post = ({
	Userid_,
	UserName,
	UserImg,
	PostImg=null,
	PostText
}) => {

	const User = useSelector(state => state.User);
	const [Liked, SetLike] = useState(false);
	const [imgcmp, setImgcmp] = useState(false);
	const [ShowEdit, setShowEdit] = useState(false);
	
	const [EditPos, setEditPos] = useState({
		x: 0,
		y: 0
	});

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

	// useEffect(() => {
	// 	return () => {
	// 		setShowEdit(false)
	// 		alert("Unmount!")
	// 	}
	// }, [setShowEdit])

	const onEditPost = (e) => {
		const box = e.target.getBoundingClientRect()
		
		setShowEdit(prev => !prev);
		
		setEditPos({
			x: box.x - 120, 
			y: box.y + 30
		});
	}

	return (
		<div className="w-full flex-col justify-center bg-neutral-900 my-4 rounded p-2"> 
			
			{
				(imgcmp) ? (
					<Iframe Obj={{
						onclick: setImgcmp,
						variables: imgcmp
					}} />	
				) : ""	
			}

			<div className="flex flex-row items-start justify-between pl-2 pt-2">
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
								<button className="hover:bg-sky-700 my-1 bg-sky-800 p-1" onClick={() => {}}>
									<span> Delete </span> <Fa icon={faTrashCan} className="transition-all cursor-pointer text-white ml-6"/> 
								</button>
							</div>
						</>
					) : ""
				}
			</div>
			
			<main className="p-2">
				{(PostText) ? <Paragraphs Text={PostText} Class="text-white my-2" /> : ""}
				<img 
					src={PostImg} alt="user avatar" 
					className={(PostImg) ? "my-4 w-full h-full visible rounded" : "hidden"} 
					onClick={PostOnClick}
				/>
			</main>

			<div className="pl-2 pb-2">
				<Fa icon={ faHeart } className={`transition-all cursor-pointer ${(Liked) ? "text-rose-700" : "text-white"}`} onClick={like} size="lg" />
				<Fa icon={ faComment } className="transition-all cursor-pointer mx-5 text-white" size="lg" />
				<Fa icon={ faShare } className="transition-all cursor-pointer text-white" size="lg" />
			</div>

		</div>	
	)

}


export default Post;
