import { faHeart, faComment, faShare } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { useState } from "react";
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

			<div className="flex flex-row items-start justify-start py-2">
				<Link to={`/Accounts/${Userid_}`}>
					<img src={UserImg ? UserImg : "/img/defUser.jpg"} alt="user avatar" className="rounded-full w-10 h-10" />
				</Link>

				<span className="ml-2">
					<h5 className="font-semibold text-base text-sky-100"> { UserName } </h5>
					<h5 className="font-thin text-sm text-green-700 "> #{ Userid_ } </h5>
				</span>
			</div>
			
			<main className="py-2">
				{(PostText) ? <Paragraphs Text={PostText} Class="text-white my-2" /> : ""}
				<img 
					src={PostImg} alt="user avatar" 
					className={(PostImg) ? "my-4 w-full h-full visible rounded" : "hidden"} 
					onClick={PostOnClick}
				/>
			</main>

			<div className="py-2">
				<Fa icon={ faHeart } className={`transition-all cursor-pointer ${(Liked) ? "text-rose-700" : "text-white"}`} onClick={like} />
				<Fa icon={ faComment } className="transition-all cursor-pointer mx-3 text-white" />
				<Fa icon={ faShare } className="transition-all cursor-pointer text-white" />
			</div>

		</div>	
	)

}


export default Post;
