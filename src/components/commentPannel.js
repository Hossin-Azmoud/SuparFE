

import { useState, useEffect, useRef } from "react";
import { Comment } from "../server/serverFuncs";
import { UserDisplay } from "./UserUI";

const CommentPannel = ({
	Comments,
	setComments,
	postObject,
	User,
	uuid,
	NotificationFunc
}) => {
	
	const [rows, setRows] = useState(3);	
	const [commentText, setCommentText] = useState("");
	const countLines = (t) => t.split('\n').length;	
	const commentField = useRef(null); 
	const onComment = (e) => setCommentText(e.target.value);

	useEffect(() => {
		setRows(countLines(commentText))
	}, [commentText])

	const Addcomment = (e) => {
	
		e.preventDefault()
		var New = Comments;
		
		const ob = {
			text: commentText,
			user: {
				UserName: User.UserName,
				img: User.img,
				id_: User.id_
			}
		}

		New.push(ob);
		setComments(New);
		Comment(postObject.pid, User.id_, commentText, uuid)
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
				setComments(New);
				NotificationFunc({
					text: "comment was not added",
					status: "info"
				})
			}
		})

		.catch(e => {
			setComments(New);
			NotificationFunc({
				text: `an error accured! ${e}`,
				status: "error"
			})
		})
	}

	return (
		<section className="flex items-start justify-center bg-black p-6 sm:w-[40%] h-full w-full sm:overflow-y-scroll">
			{/* map the comments to this section if there is any. */}
			
			<div className="p-3 flex w-full flex-col justify-center items-start">
				<textarea rows={rows + 1} ref={commentField} onChange={onComment} className="NoBar my-3 rounded-md w-full focus:border-sky-700 border-neutral-700 border resize-none p-3 text-white bg-none px-2 outline-none bg-black p-2 w-full" type="text" placeholder="say something" /> 

            	<div className="flex flex-row items-center justify-center mt-2">
					<button onClick={Addcomment} title="Send post" className="text-white p-2 hover:bg-sky-500 bg-sky-600 rounded">
	              		comment
	              	</button>
            	</div>


            	{ (Comments.length > 0) ? Comments.map((v, i) => <CommentUI key={i} obj={v} />) : "" }

			</div>

		</section>
	)
}

const CommentUI = ({ obj }) => {
	
	return (
		<div className="bg-neutral-900 w-full my-2 rounded-md p-2">
			<UserDisplay Userid_={obj.user.id_} UserName={obj.user.UserName} UserImg={obj.user.img}/>
			<p className="ml-1 mt-2 text-white text-[1em]"> { obj.text } </p>	
		</div>
	)
}

export { CommentPannel };
