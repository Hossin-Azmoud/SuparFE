import { useState, useEffect, useRef } from "react";
import { faHeart, faComment, faEdit, faShare, faEllipsisVertical, faTrashCan, faClose, faAdd, faEnvelope } from "@fortawesome/free-solid-svg-icons";
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



const ChatUI = ({
	NotificationFunc = () => {},
	Conn = {
		send: (o) => { console.log(o, "\n", o.length) }
	},
	User
}) => {

	const [Convos, setConvos] = useState(null);
	const [Users, setUsers] = useState([]);
	const [Other, setOther] = useState(null);
	// TODO: Fetch the user messages!
	const [IsLoading, setIsLoading] = useState(true);
	const [OpenNewConv, setOpenNewConv] = useState(false);

	const SendMessage = (conversation_id, text, mt, other_id) => {
		Conn.send(JSON.stringify({
			code: 200,
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

	const GetRelations = () => {
		let temp = []
		GetUserFollowers(User.id_)
		.then(r => r.json())
		.then(J => {
			if(J.code === 200) {
				temp = [...temp, ...J.data]
			}
		})
		.catch(e => console.log(e))

		GetUserFollowings(User.id_)
		.then(r => r.json())
		.then(J => {
			if(J.code === 200) {
				for(let i = 0; i < J.data.length; i++) {
					if(!(temp.includes(J.data[i]))) {
						temp.push(J.data[i]);
					}
				}
			}
		})
		.finally(() => {
			
			const callback = (a) => {
				setUsers(a);
				setIsLoading(false);
			}

			GetUserObjects(temp, callback);
			
		})
		.catch(e => console.log(e))
	}

	const GetUserObjects = (Array_, callback) => {
		
		var temp = []
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
				temp.push(UObject);
				if(Array_.length === temp.length) {
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
		let temp;
		let ids = [];		
		
		GetUserConversations(User.id_)
		.then(r => r.json())
		.then(J => {
			if(J.code === 200) {
				if(J.data !== null && J.data !== undefined) {
					temp = J.data;
					console.log(J.data)
				}
			}
		})
		.finally(() => {
			
			temp.map((c) => {
				ids.push((c.fpair === User.id_) ? c.spair : c.fpair);	
				return c;
			});

			const callback = (data) => {
				for(let i = 0; i < temp.length; i++) {
					temp[i].Other = data[i];
				}
				console.log(temp);
				// setConvos(temp);
			}

			GetUserObjects(ids, callback);
		})
		.catch(e => console.log(e))
	}

	useEffect(() => {
		// TODO require a token! so not everyone can get the messages or send shit!
		GetAllConversations();
		
		return () => {
			setIsLoading(true);
			setUsers([]);
		};

	}, [])

	return (
		
		<UIWrapper>
			{
				(Other) ? (
					<ConversationUI 
						CurrUserId={User.id_}
						NotificationFunc={NotificationFunc}
						Conn={Conn}
						Other={Other}
					/>
				) : (
				<>			
					<div className="w-full mx-auto p-3 bg-neutral-900 rounded border border-neutral-700 flex flex-row justify-between items-center">
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
									(Users.length > 0) ? (
										Users.map(v => {
												return (
													<div key={v.id_} className="my-2 bg-neutral-800 p-2 rounded-md flex flex-row justify-between items-center">
														
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
						(Convos !== null && Convos !== undefined && Convos.messages !== null) ? (
							Convos.map(c => {
								return (
									<div key={c.id} className="w-full bg-neutral-900 p-2 rounded-md flex flex-row justify-between items-center"> 
										<div className="rounded-md flex flex-row justify-start items-center">
											<img 
												src={c.Other.img} 
												alt="User image"
												className="w-10 h-10 rounded-md"
											/>
											<div className="text-white mx-2 text-sm">
												<p>{ c.Other.UserName }</p>
												<p className="text-orange-300"> { JSON.stringify(c.messages) } </p>
											</div>

										</div>
										
									</div>
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
	//TODO This one gets one information, fetchs the rest of the things from the serevr.
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
			);
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
		Conn={Conn}
		Other={Other}
	/>
}

const ConversationUI = ({ 
	conversation = null, 
	CurrUserId,
	NotificationFunc = () => {},
	Conn,
	Other
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
	const [MAXID, setMAXID] = useState((conversation) ? conversation.length : 0);
	const getSide = (id) => ((id === CurrUserId) ? "left" : "right");
	
	const Send_Message = (text) => {
		if(Conversation) {
			var ob = {
				code:200,
				action: MSG,
				data: {
					conversation_id: Conversation.id,
					data: { 
						text, 
						mt: "plain-text"
					},
					other_id: (Conversation.fpair === CurrUserId) ? Conversation.spair : Conversation.fpair
				}
			}

			setConversation(p => {
				
				var temp = p;
				
				if(temp.messages === undefined || temp.messages === null) {
					temp.messages = [];
				}

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


			Conn.send(JSON.stringify(ob));
		}
	}

	useEffect(() => {
		
		if(Conversation) { 
			if(Conversation.messages !== undefined && Conversation.messages !== null) {
				Conversation.messages.map((v) => {v.side = getSide(v.topic_id)})
			}
		}

	}, [Conversation])

	const GetConv = (ID, callback) => {
		let temp;
		GetUserConversationbyId(CurrUserId, ID)
		.then((r) => {
			return r.json()
		})
		.then((J) => {
			if(J.code === 200) {
				temp = J.data;
			} else if (J.code === 204){
				temp = {};
			} else {
				alert(JSON.stringify(J));
			}
			console.log(J.data);
		})
		.finally(() => {
			// temp.map((v) => {})
			callback(temp);
		})
	}

	useEffect(() => {
		let Id;
		console.log(Conn);
		if(Conversation === null) {
			NewConversation(CurrUserId, Other.id_)
			.then((req) => {
				return req.json()
			})
			.then((Json) => {
				if(Json.code === 200) {
					Id = Json.data
				};
			})
			.finally(() => {
				if(Id) {
					const callback = (data) => {
						setConversation(data);
						console.log(data);
					}

					GetConv(Id, callback);
				}
			})
			.catch(e => console.log(e))
		}

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
									(Conversation.messages !== undefined && Conversation.messages !== null) ? (
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

export default ChatUI;
export { ConversationUI };