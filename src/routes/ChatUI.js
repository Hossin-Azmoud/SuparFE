import { useState, useEffect } from "react";
import { faHeart, faComment, faEdit, faShare, faEllipsisVertical, faTrashCan, faClose, faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { timeAgo } from "../Util/time";
const ChatUI = ({
	NotificationFunc = () => {},
	Socket = null,
	User
}) => {

	const [Convos, setConvos] = useState(null)
	// TODO: Fetch the user messages!

	useEffect(() => console.log("Hello, Spaaaasssssioo!"), [])	

	return (
		<div className="flex w-[90%] sm:w-[600px] flex-col justify-start items-start my-2">
			<div className="w-full mx-auto p-3 bg-neutral-900 rounded border border-neutral-700 flex flex-row justify-between items-center">
				<h1 className="text-lg text-white"> Chat UI For Users </h1>
				
				<div className="flex flex-row justify-between items-center gap-2">
					<Fa title="Add new conversation" icon={ faAdd } className="bg-neutral-700 shadow-black shadow-2xl cursor-pointer p-2 text-white rounded" size="1x" />		
					<Fa title="Add new conversation" icon={ faAdd } className="bg-neutral-700 shadow-black shadow-2xl cursor-pointer p-2 text-white rounded" size="1x" />		
					<Fa title="Add new conversation" icon={ faAdd } className="bg-neutral-700 shadow-black shadow-2xl cursor-pointer p-2 text-white rounded" size="1x" />			
				</div>
			</div>
			
			<MessageUI msg={"Hii"} Align={"left"}/>
			<MessageUI msg={"Yoo"}/>

		</div>
	)

}

const MessageUI = ({ msg, Align="right" }) => {
	
	const [side, setSide] = useState(null);
	
	const StMap = {
		left: "items-start",
		right: "items-end",
	}

	const Colors = {
		left: "bg-sky-500 text-white",
		right: "bg-slate-100 text-slate-800"
	}

	useEffect(() => {
		setSide(Align);

		// const I = setInterval(() => {
		// 	setSide(p => (p === "right") ? "left" : "right");
		// }, 1000)

		return () => {
			// clearInterval(I);
			setSide(null);
		}

	}, []);


	return (
		<div className={`${StMap[side]} my-2 reveal duration-[2s] transition-all ease-in-out flex flex-col justify-start w-full`}>
			<div className={`w-full rounded-md w-[250px] flex flex-row items-center justify-start p-2 ${Colors[side]}`}>
			{/*	<img src={User.img} className="h-10 shadow-black shadow-2xl rounded w-10"/>*/}
				<p className="mx-1"> {msg} </p>
			</div>
			<span className="text-neutral-600 text-xs p-1 "> { timeAgo.format(new Date()) } </span>	
		</div> 
	)
}


export default ChatUI;