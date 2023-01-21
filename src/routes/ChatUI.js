import { useState, useEffect, useRef } from "react";
import { faHeart, faComment, faEdit, faShare, faEllipsisVertical, faTrashCan, faClose, faAdd } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { timeAgo } from "../Util/time";
import { MSG } from "../server/Var";
import { Link, useParams } from "react-router-dom";
import { UIWrapper } from "../components/microComps"
import {
	GetUserById,
	GetUserFollowers
} from "../server/serverFuncs";

const ChatUI = ({
	NotificationFunc = () => {},
	Conn = {
		send: (o) => { console.log(o, "\n", o.length) }
	},
	User
}) => {


	const [Convos, setConvos] = useState(null)
	// TODO: Fetch the user messages!
	const SendMessage = (conversation_id, text, mt, other_id) => {
		Conn.send(JSON.stringify({
			code:200,
			action: MSG,
			data: {
				conversation_id,
				data: { 
					text, 
					mt 
				},
				other_id
			}
		}));
	}

	const GetAllConversations = () => console.log("Getting all conversations!!")

	useEffect(() => {
		// TODO require a token! so not everyone can get the messages or send shit!
		GetAllConversations()
		return () => {
			console.log("Quiting the convos!")
		}
	}, [])

	return (
		
		<UIWrapper>
		
			<div className="w-full mx-auto p-3 bg-neutral-900 rounded border border-neutral-700 flex flex-row justify-between items-center">
				<h1 className="text-lg text-white"> Chat UI For Users </h1>
				
				<div className="flex flex-row justify-between items-center gap-2">
					<Fa title="Add new conversation" icon={ faAdd } className="bg-neutral-700 shadow-black shadow-2xl cursor-pointer p-2 text-white rounded" size="1x" />		
					<Fa title="Add new conversation" icon={ faAdd } className="bg-neutral-700 shadow-black shadow-2xl cursor-pointer p-2 text-white rounded" size="1x" />		
					<Fa title="Add new conversation" icon={ faAdd } className="bg-neutral-700 shadow-black shadow-2xl cursor-pointer p-2 text-white rounded" size="1x" />			
				</div>
			</div>
			
			<MessageUI msg={"Hii"} Align={"left"} TimeStamp={ new Date() }/>
			<MessageUI msg={"Yoo"} TimeStamp={ new Date() }/>
			<MessageInputUI />

		</UIWrapper>
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

const NOTIMPL = () => <h1 className="bg-red-500 p-4 m-2 border text-2xl text-bold"> NOT IMPLEMENTED! </h1>

// const DiscussionUI = () => {
// 	let { conversation_id } = useParams();
	
// 	useEffect(() => {
// 		alert(conversation_id);
// 	}, []);

// 	return (
// 		<NOTIMPL />
// 	)
// };


const ConversationUI = ({ 
	conversation = null, 
	CurrUserId,
	NotificationFunc = () => {},
	Conn
}) => {
	/*
		conversation = {
			id: 0
			fpair: 0
			Spair: 0
			messages: [{
				id: 0
				conversation_id: conversation.id
				data: {
					text: string
					mt: string
				}
				other_id: 0
				topic_id: 0
				ts: 0
			}]
			ts: new Date()
		}
	*/

	let { conversation_id } = useParams();
	
	conversation_id = parseInt(conversation_id);
	const [Conversation, setConversation] = useState(conversation);
	const [OtherUser, setOtherUser] = useState(null);
	const [MAXID, setMAXID] = useState(0);
	const getSide = (id) => ((id === CurrUserId) ? "left" : "right");
	
	const Send_Message = (text) => {
		if(Conversation) {
			var ob = {
				code:200,
				action: MSG,
				data: {
					conversation_id,
					data: { 
						text, 
						mt: "plain-text"
					},
					other_id: (Conversation.fpair === CurrUserId) ? Conversation.spair : Conversation.fpair
				}
			}

			setConversation(p => {
				
				var temp = p;
				
				temp.messages.push({
					id: MAXID + 1,
					...ob.data,
					topic_id: CurrUserId,
					ts: new Date(),
					side: "left"
				})

				setMAXID(MAXID + 1);
				// scroll(0, document.body.scrollHeight + 400);
				return temp;
			});


			// Conn.send(JSON.stringify(ob));	
		}
	}


	useEffect(() => {
		
		if(Conversation) {
			Conversation.messages.map((v) => {v.side = getSide(v.topic_id)})
		}

	}, [Conversation])


	useEffect(() => {
		// Collect sides into the messages obj?
		if (Conversation === null) {
			var Data = {
				id: conversation_id,
				fpair: CurrUserId,
				spair: 46,
				messages: [],
				ts: new Date()
			};

			setMAXID(20);

			for(let i = 20; i > 0; i--) {
				Data.messages.push({
					id: i,
					conversation_id: conversation_id,
					data: {
						text: "Hello",
						mt: "plain-text",
					},
					other_id: ((i%2 === 0) ? CurrUserId : 46),
					topic_id: ((!(i%2 === 0)) ? CurrUserId : 46),
					ts: new Date() - 60 * i * 1000
				})
			}

			Data.messages.map(
				(v) => {
					v.side = getSide(v.topic_id)
				}
			);

			// fetchOtherUser(Data);
			setConversation(Data);
		}

		
		// {
		// 	id: 2,
		// 	conversation_id: conversation_id,
		// 	data: {
		// 		text: "Hiiii",
		// 		mt: "plain-text",
		// 	},
		// 	other_id: 46,
		// 	topic_id: CurrUserId,
		// 	ts: new Date() - 60 * 2 * 1000
		// },
		// {
		// 	id: 3,
		// 	conversation_id: conversation_id,
		// 	data: {
		// 		text: "How are you!! long time no see!",
		// 		mt: "plain-text",
		// 	},
		// 	other_id: CurrUserId,
		// 	topic_id: 46,
		// 	ts: new Date() - 1000 * 60 * 2
		// },
		// {
		// 	id: 4,
		// 	conversation_id: conversation_id,
		// 	data: {
		// 		text: "Nothing much !",
		// 		mt: "plain-text",
		// 	},
		// 	other_id: 46,
		// 	topic_id: CurrUserId,
		// 	ts: new Date()
		// }

		GetUserById(1720, 1718)
		.then(r => r.json())
		.then(Json => {
			if(Json.code === 200) {
				setOtherUser(Json.data);
			}
		})
		.catch(e => console.log(e))

	}, []);

	return (
		<UIWrapper ExtendStyles="pb-16">
			{
				(OtherUser) ? (
					<>
						<div className="border-b py-4 border-b-slate-900 w-full flex flex-col justify-center items-center">
							<img 
								src={OtherUser.img} 
								alt="User image"
								className="w-24 h-24 rounded-full my-2"
							/>
						
							<h1 className="text-white text-center text-md font-semibold"> 
								{OtherUser.UserName} 
							</h1>
							<p className="text-sm  text-orange-300">
								{OtherUser.bio}
							</p>
						</div>
						
						<div className="w-full">
							{
								(Conversation !== null) ? (
									(Conversation.messages.length > 0) ? (
										// <p>  {JSON.stringify(Conversation)} </p>
										Conversation.messages.map(
											(m) => <MessageUI 
												key={m.id} 
												msg={m.data.text} 
												Align={m.side}
												TimeStamp={m.ts}
											/>
										)
									) : ""
								) : ""
							}
						</div>
					</>
				) : ""
			}

			<MessageInputUI SendMessage={Send_Message}/>

		</UIWrapper>
	)
}

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

export default ChatUI;
export { ConversationUI };