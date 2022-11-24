import { faHeart } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Link } from "react-router-dom";
import { Paragraphs } from "./microComps";

const Post = ({
	Userid_,
	UserName,
	UserImg,
	PostImg=null,
	PostText
}) => {

	const [Liked, SetLike] = useState(false);
	
	const like = () => {
		SetLike(!Liked);
	}

	return (
		<div className="w-full flex-col justify-center bg-neutral-900 my-4 rounded p-2"> 
			
			<div className="flex flex-row items-start justify-start">
				<Link to={`/Accounts/${Userid_}`}>
					<img src={UserImg ? UserImg : "/img/defUser.jpg"} alt="user avatar" className="rounded-full w-10 h-10" />
				</Link>

				<span className="ml-2">
					<h5 className="font-semibold text-base text-sky-100"> { UserName } </h5>
					<h5 className="font-thin text-sm text-green-700 "> #{ Userid_ } </h5>
				</span>
			</div>
			
			{(PostText) ? <Paragraphs Text={PostText} Class="text-white my-2" /> : ""}
			<img src={PostImg} alt="user avatar" className={(PostImg) ? "my-4 w-full h-full visible rounded" : "hidden"} />
			<Fa icon={ faHeart } className={`transition-all cursor-pointer ${(Liked) ? "text-rose-700" : "text-white"}`} onClick={like} />
		
		</div>	
	)

}


export default Post;
