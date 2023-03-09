// BUG HERE!
// DESC: When the user sends the first message in a new conversation, the conversations tree don't get updated. hence the message is never shown to the user.
// TODO: Make interactive buttons, back, cancel, newMessage(floating)
// TODO-FEATURE: Send images, send videos, send files, like-msg.


import { useState, useEffect, useRef } from "react";
import { faArrowLeftLong, faHeart, faComment, faEdit, faShare, faEllipsisVertical, faTrashCan, faClose, faAdd, faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { timeAgo } from "../Util/time";
import { MSG } from "../server/Var";
import { Link, useParams } from "react-router-dom";
import { UIWrapper } from "../components/microComps";
import { MessageUI, MessageInputUI } from "../components/MessageUI";
import Loader from "../components/Loader";

import {
	GetUserById,
	GetUserFollowers,
	GetUserFollowings,
	GetUserConversations,
    GetUserConversationbyId,
    NewConversation
} from "../server/serverFuncs";

// Utill
const ScrollTop = () => scroll(0, 0);
const ScrollBottom = () => scroll(0, document.body.scrollHeight);

const ChatUI = ({
	NotificationFunc = () => {},
	NewMessages = [],
	Conn,
	User,
	flushMessages	
}) => {

	const [Convos, setConvos] = useState(null);
	const [Users, setUsers] = useState([]);
	const [Other, setOther] = useState(null);
	
	// TODO: Fetch the user messages!
	const [IsLoading, setIsLoading] = useState(true);
	const [OpenNewConv, setOpenNewConv] = useState(false);
	const [SelectedConversation, SelectConversation] = useState(null);
	const getSide = (id) => ((id === User.id_) ? "left" : "right");
	

	const GetRelations = () => {
		let TempUserRelationShips = []
		GetUserFollowers(User.id_)
		.then(r => r.json())
		.then(J => {
			if(J.code === 200) {
				TempUserRelationShips = [...TempUserRelationShips, ...J.data]
			}
		})
		.catch(e => console.log(e))

		GetUserFollowings(User.id_)
		.then(r => r.json())
		.then(J => {
			if(J.code === 200) {
				for(let i = 0; i < J.data.length; i++) {
					if(!(TempUserRelationShips.includes(J.data[i]))) {
						TempUserRelationShips.push(J.data[i]);
					}
				}
			}
		})
		.finally(() => {
			
			const callback = (a) => {
				setUsers(a);
				setIsLoading(false);
			}

			GetUserObjects(TempUserRelationShips, callback);
			
		})
		.catch(e => console.log(e))
	}

	const GetUserObjects = (Array_, callback) => {
		
		var temp = {}
		var UObject;
		for(let i = 0; i < Array_.length; i++) {
			GetUserById(Array_[i], User.id_)
			.then(r => r.json())
			.then(J => {
				if (J.code === 200) {
					UObject = J.data;
				} else {
					alert(J.code)
					alert(J.data)
				}
			})
			.finally(() => {
				temp[UObject.id_] = UObject;
				
				if(Array_.length === Object.keys(temp).length) {
					callback(temp);
				}

			})
			.catch(e => console.log(e));
		}
	}

	const openNewConvUI = () => {
		setOpenNewConv(true);
		if(!IsLoading) setIsLoading(true)
		GetRelations();
	}

	const GetAllConversations = () => {
		let tempConversations;
		let ids = [];		
		
		GetUserConversations(User.id_)
		
		.then(r => {
			// if(r.status_code !== 200) { console.log(r) }
			return r.json()
		})
		
		.then(J => {
			if(J.code === 200) {
				if(J.data !== null && J.data !== undefined) {
					tempConversations = J.data;
				}
			}
		})
		
		.finally(() => {
			if(tempConversations) {
				
				Object.values(tempConversations).map(c => {
					ids.push((c.fpair === User.id_) ? c.spair : c.fpair)
					return c
				})

				const callback = (data) => {
					
					Object.keys(tempConversations).map(k => {
						const OTHER_ID = (tempConversations[k].fpair === User.id_) ? tempConversations[k].spair : tempConversations[k].fpair;
					
						tempConversations[k].Other = data[OTHER_ID];

						if(tempConversations[k].messages) {
							tempConversations[k].messages.map(v => {
								v.side = getSide(v.topic_id);
								return v;
							})
						}
					})

					setConvos(tempConversations);
				}

				GetUserObjects(ids, callback);
			}
		})

		.catch(e => console.log(e))
	}

	useEffect(() => {
		// TODO require a token! so not everyone can get the messages or send shit!
		GetAllConversations();
		ScrollBottom();
		return () => {
			setIsLoading(true);
			setUsers([]);
		};

	}, [])

	useEffect(() => {
		// TODO: When a message comes in we need to make it as a non-seen message and the prototype is:
		/* newMessage => SignalToUI => AddToConversation using the ID. */
		
		if(NewMessages.length > 0) {
			OnNewMessagesEvent();
		}
	}, [NewMessages.length])
	
	const OnNewMessagesEvent = () => {
		if(Convos) NewMessages.map(m => DispatchNewMessageEvent(m))
		flushMessages();
	}

	const GetUserObject = (uuid) => {
		var ob = {};

		GetUserById(uuid, User.id_)
		.then(r => r.json())
		.then(J => {
			if (J.code === 200) {
				ob = J.data;
			}
		})
		.catch(e => console.log(e));
		return ob;
	}

	const DispatchNewMessageEvent = NewMsg => {
		var tempConversations = Convos;
		const key = String(NewMsg.conversation_id)
		// After the update.
		if(Object.keys(tempConversations).includes(key)) {
			if(tempConversations[key].message_count === 0) tempConversations[key].messages = [];
			tempConversations[key].messages.push(NewMsg);
			tempConversations[key].message_count++;
		} else {
			
			tempConversations[key] = {
				id: parseInt(key),
				fpair: NewMsg.other_id,
				spair: NewMsg.topic_id,
				messages: [NewMsg],
				message_count: 1,
				ts: new Date()
			}

			tempConversations[key].Other = GetUserObject(NewMsg.topic_id);
			console.log("New socket msg!")
			console.log(tempConversations[key]);
		}

		setConvos(tempConversations);
		ScrollBottom();
	}

	return (
		
		<UIWrapper>
			{
				(Other) ? (
					<ConversationUI 
						CurrUserId={ User.id_ }
						NotificationFunc={ NotificationFunc }
						Connexion={ Conn }
						Other={ Other }
						conversation={ SelectedConversation }
						callback={ DispatchNewMessageEvent }
					/>
				) : (
				<>			
					<div className="w-full my-4 mx-auto p-3 bg-neutral-900 rounded border border-neutral-700 flex flex-row justify-between items-center">
						<div className="flex flex-row items-start">
							<img
								src={User.img} 
								alt="User image"
								className="w-10 h-10 rounded-md"
							/>
							
							<div className="text-white mx-2 text-sm">
								<p>{ User.UserName }</p>
								<p className="text-orange-300"> #{ User.id_ } </p>
							
							</div>

						</div>
						<button onClick={openNewConvUI} className="transition-all ease-in-out hover:bg-sky-500 flex flex-row items-center justify-center bg-neutral-700 shadow-black shadow-2xl cursor-pointer p-2 text-white rounded">
							<span>
								New conversation
							</span>
							
							<Fa title="Add new conversation" className="mx-2" icon={ faAdd } size="1x" />
						</button>
					</div>
					{
						(OpenNewConv) ? (
							<div className="p-2 pt-14 bg-neutral-900 w-[90%] md:w-[500px] h-[500px] z-10 overflow-y-scroll border border-slate-800 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">

							<div className="fixed left-0 top-0 w-full flex items-center shadow-xl justify-between p-3 bg-sky-900">
								
								<button className="p-4 rounded-full flex justify-center items-center h-[30px] w-[30px]">
									<Fa icon={faClose} onClick={() => setOpenNewConv(false)} className="text-white" size="lg" />
								</button>
								<h1 className="text-white">  Users  </h1>

							</div>

							{ 
								(IsLoading) ? (
									<div className="w-full h-full flex flex-row items-center justify-center">
										<Loader size="20" />
									</div>
								) : (
									(Object.values(Users).length > 0) ? (
										Object.values(Users).map(v => {
												return (
													<div key={v.id_} className="my-2 bg-neutral-900 p-2 rounded-md flex flex-row justify-between items-center">
														<div className="rounded-md flex flex-row justify-start items-center">
															
															<img 
																src={v.img} 
																alt="User image"
																className="w-10 h-10 rounded-md"
															/>
															
															<div className="text-white mx-2 text-sm">
																<p>{ v.UserName }</p>
																<p className="text-orange-300"> #{ v.id_ } </p>
															</div>

														</div>
														
														<Fa onClick={() => setOther(v)} icon={faEnvelope} size="lg" className="transition-all ease-in-out hover:bg-sky-500 cursor-pointer text-white mx-2 p-3 rounded-full shadow-md"/>

													</div>
												)
											}
										)
									) : ""
								)
							}
						</div>
						) : ""
					}

					{
						((Convos !== null) && (Convos !== undefined)) ? (
							Object.values(Convos).reverse().map(c => {
								return (
									(c.messages) ? (
										<div onClick={() => {
											SelectConversation(c);
											setOther(c.Other);
										}} key={c.id} className="w-full rounded my-1 bg-neutral-900 p-2 flex flex-row justify-between items-center cursor-pointer"> 
												
											<div className="rounded-md flex flex-row justify-start items-center">
												
												<img 
													src={c.Other.img} 
													alt="User image"
													className="w-10 h-10 rounded-md"
												/>
												<div className="text-white mx-2">
													<p className="text-base"> 
														{ c.Other.UserName }
														<span className="text-xs text-neutral-500 mx-2">
															{ timeAgo.format(new Date(c.messages[c.messages.length - 1].ts)) } 
														</span>  
														</p>
													<p className="text-sm text-orange-300"> { c.messages[c.messages.length - 1].data.text } </p>
												</div>

											</div>
										</div>
									) : ""
								)
							})
						) : ""
					}

				</>
			)
		}
		</UIWrapper>
	)
}


const NOTIMPL = () => <h1 className="bg-red-500 p-4 m-2 border text-2xl text-bold"> NOT IMPLEMENTED! </h1>

const ConversationRoute = ({ 
	CurrUserId,
	NotificationFunc = () => {},
	Conn
}) => {
	// TODO This one gets one information, fetchs the rest of the things from the serevr.
	
	let { conversation_id } = useParams();
	conversation_id = parseInt(conversation_id);
	const [FetchedConv, setFetchedConv] = useState({});
	const [Other, setOther] = useState({});
	
	const DummyDataPup = () => {	
			var Data = {
				id: conversation_id,
				fpair: CurrUserId,
				spair: 46,
				messages: [],
				ts: new Date()
			};

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
			)
	
			return Date;
	}
	
	useEffect(() => {
		// Collect sides into the messages obj?
		let Other;
		let Data;
		
		GetUserConversationbyId(CurrUserId, conversation_id)
		.then(r => r.json())
		.then(Json => {
			if(Json.code === 200) {
				Data = Json.data
			}
		})
		.finally(() => {
			if(Data) {
				setFetchedConv(Data);
				setOther((CurrUserId === Data.spair) ? Data.fpair : Data.spair);
			}
		})
	}, []);

	return <ConversationUI 
		conversation={FetchedConv}
		CurrUserId={CurrUserId}
		NotificationFunc={NotificationFunc}
		Connexion={ Conn }
		Other={ Other }
	/>
}

const ConversationUI = ({ 
	conversation = null, 
	CurrUserId,
	NotificationFunc = () => {},
	Connexion,
	Other,
	callback = (id, ob) => { console.log(id - 1, ob) }
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

	const [Conversation, setConversation] = useState(conversation);
	const [OtherUser, setOtherUser] = useState(Other);
	const [MsgCount, setMsgCount] = useState((conversation) ? ((conversation.messages !== null) ? conversation.messages.length : 0 ) : 0)
	const getSide = (id) => ((id === CurrUserId) ? "left" : "right");
	
	// const Send_image = (data) => {
	// 	if(Conversation) {
	// 		var tempConversation = Conversation;
	// 		if(tempConversation.message_count === 0) tempConversation.messages = [];

	// 		const SocketMsg = {
				
	// 			code: 200,
	// 			action: MSG,
	// 			data: {
	// 				id: (tempConversation.message_count === 0) ? tempConversation.message_count + 1 : 1,
	// 				conversation_id: tempConversation.id,
	// 				data: { 
	// 					text, 
	// 					mt: "plain-text"
	// 				},
	// 				ts: new Date(),
	// 				other_id: (tempConversation.fpair === CurrUserId) ? tempConversation.spair : tempConversation.fpair
	// 			}

	// 		}

	// 		const Msg = {
	// 			...SocketMsg.data,
	// 			topic_id: CurrUserId,
	// 			ts: new Date(),
	// 			side: "left"
	// 		}
			
	// 		setMsgCount(p => p + 1)
	// 		scroll(0, document.body.scrollHeight + 400);
	// 		callback(Msg);
			
	// 		if(Conversation.message_count < tempConversation.message_count ) {
	// 			if(Conversation.message_count === 0) tempConversation.messages = [];
				
	// 			tempConversation.messages.push(Msg)
	// 			tempConversation.message_count++;
	// 			setConversation(tempConversation);
	// 		}

	// 		Connexion.send(JSON.stringify(SocketMsg));
	// 	}

	// 	ScrollBottom();
	// }

	const Send_Message = (text) => {
		
		if(Conversation) {
			var tempConversation = Conversation;
			if(tempConversation.message_count === 0) tempConversation.messages = [];

			const SocketMsg = {
				
				code: 200,
				action: MSG,
				data: {
					id: (tempConversation.message_count === 0) ? tempConversation.message_count + 1 : 1,
					conversation_id: tempConversation.id,
					data: { 
						text, 
						mt: "plain-text"
					},
					ts: new Date(),
					other_id: (tempConversation.fpair === CurrUserId) ? tempConversation.spair : tempConversation.fpair
				}

			}

			const Msg = {
				...SocketMsg.data,
				topic_id: CurrUserId,
				ts: new Date(),
				side: "left"
			}
			
			setMsgCount(p => p + 1)
			scroll(0, document.body.scrollHeight + 400);
			callback(Msg);
			
			if(Conversation.message_count < tempConversation.message_count ) {
				if(Conversation.message_count === 0) tempConversation.messages = [];
				
				tempConversation.messages.push(Msg)
				tempConversation.message_count++;
				setConversation(tempConversation);
			}

			Connexion.send(JSON.stringify(SocketMsg));
		}

		ScrollBottom();
	}

	useEffect(() => {
		
		if(Conversation) { 
			if(Conversation.message_count > 0) {
				Conversation.messages.map(
					(v) => {
						v.side = getSide(v.topic_id);
						if(v.id === NaN) v.id = Conversation.messages[Conversation.messages.length - 1].id + 1;
					}
				)
			}
		}

	}, [MsgCount])

	const GetConv = (ID, updateConversation) => {
		
		let tempConversation;

		GetUserConversationbyId(CurrUserId, ID)
		.then((r) => {
			return r.json()
		})
		.then((J) => {
			if(J.code === 200) {
				tempConversation = J.data;
			} else if (J.code === 204){
				tempConversation = {};
			} else {
				// BUG!
				alert(JSON.stringify(J));
			}

		})
		.finally(() => {
			// tempConversation.map((v) => {})
			updateConversation(tempConversation);
		})
	}

	useEffect(() => {
		let Id;
		
		if(Conversation === null) {
			NewConversation(CurrUserId, Other.id_)
			.then((req) => req.json())
			.then((Json) => {
				if(Json.code === 200) {
					Id = Json.data
				};
			})
			.finally(() => {
				if(Id) {

					const update = (data) => {
						setConversation(data);
						
						if(data) {
							setMsgCount((data.messages !== null) ? data.messages.length : 0)
						}
					}

					GetConv(Id, update);
				}
			})
			.catch(e => console.log(e))
		}

		return () => {
			setConversation([]);
			setMsgCount(0);
			setOtherUser(null);
		}
	}, []);

	return (
		<section className="pb-16 w-full">
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
									(Conversation.messages !== undefined && Conversation.messages !== null) ? (
										(Conversation.messages.length > 0) ? (
										// <p>  { JSON.stringify(Conversation) } </p>
											Conversation.messages.map(
												(m) => <MessageUI 
													key={m.id} 
													msg={m.data.text} 
													Align={m.side}
													TimeStamp={new Date(m.ts)}
												/>
											)
										) : ""
									) : ""
								) : ""
							}

						</div>
					</>
				) : ""
			}

			<MessageInputUI SendMessage={Send_Message}/>
		</section>
	)
}

export default ChatUI;
export { ConversationUI };