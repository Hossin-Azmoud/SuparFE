import { useState, useEffect, useRef } from "react";
import { timeAgo } from "../Util/time";


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
			<span className="text-neutral-600 text-xs p-1 "> { timeAgo.format(TimeStamp) } </span>	
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

	const OnTypingText = (e) => {
		setMsg(e.target.value);
	}

	useEffect(() => {
		if(msg) {
			setRow(countLines(msg));
		}
		
		return () => {
			setRow(1);
		}

	}, [msg])

	const Send = (e) => {
		e.preventDefault();
		// TODO send the data
		SendMessage(msg);
		// scroll(0, document.body.scrollHeight + 10)
	}
	
	return (

		<form className="w-full border-slate-700 border bg-neutral-900 rounded mx-auto flex items-end transition-all ease-in-out flex-col justify-between p-6 my-2 justify-center items-end w-full transition-all">
			<textarea cols="80" rows={row} ref={textField} onChange={OnTypingText} className="rounded focus:border-sky-500 border my-1 border-neutral-700 transition-all ease-in-out border-box text-white resize-none outline-none p-2 bg-black w-full" type="text" placeholder="say something" /> 
			<button className="text-white bg-blue-500 rounded p-2" onClick={Send}>
				send
			</button>
		</form>
	)
}

export { MessageUI, MessageInputUI };