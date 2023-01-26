import { useState, useEffect, useRef } from "react";
import { timeAgo } from "../Util/time";
import { faEllipsisVertical, faImage } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";

const MessageUI = ({ 
	msg, 
	Align="right", 
	TimeStamp
}) => {
	
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
		console.log(Align)
		return () => {
			// clearInterval(I);
			setSide(null);
		}
	}, []);


	return (
		<div className={`${StMap[side]} my-3 reveal duration-[2s] transition-all ease-in-out flex flex-col justify-start w-full`}>
			<div className={`w-full rounded-md w-[250px] flex flex-row items-center justify-start p-2 ${Colors[side]}`}>
			{/*	<img src={User.img} className="h-10 shadow-black shadow-2xl rounded w-10"/>*/}
				<p className="mx-1"> {msg} </p>
			</div>
			<span className="text-neutral-600 text-xs p-1 "> { timeAgo.format((typeof TimeStamp === 'object') ? TimeStamp : new Date(TimeStamp)) } </span>	
		</div> 
	)
}

const MessageInputUI = ({ 
	SendMessage = () => {}
}) => {
	const textField = useRef(null)
	
	const [row, setRow] = useState(1);
	const [msg, setMsg] = useState("");
	const countLines = (t) => t.split('\n').length;	

	const OnTypingText = (e) => setMsg(e.target.value);

	useEffect(() => {
		if(msg) {
			setRow(countLines(msg));
		}
		
		return () => {
			setRow(1);
		}

	}, [msg])

	const ResetFormState = () => {
		setMsg("");
	}

	const Send = (e) => {
		e.preventDefault()
		SendMessage(msg);
		ResetFormState();
	}
	
	return (
		<form className="w-full rounded mx-auto flex items-end transition-all border border-neutral-900 focus-within:border-sky-500 ease-in-out flex-row p-2 items-center justify-between my-2 w-full transition-all">
			<Fa icon={faImage} size="sm" className="transition-all ease-in-out cursor-pointer text-white rounded-full hover:bg-slate-900 p-2" />
			<textarea rows={row} value={msg} onChange={OnTypingText} className="p-1 mx-4 rounded transition-all ease-in-out border-box text-white resize-none outline-none bg-black w-full" type="text" placeholder="say something" /> 
			<button className="text-white bg-blue-500 cursor-pointer rounded px-2 py-1" onClick={Send}>
				send
			</button>
		</form>
	)
}

export { MessageUI, MessageInputUI };