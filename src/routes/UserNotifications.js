
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { faBell  } from '@fortawesome/free-solid-svg-icons';
import { Link } from "react-router-dom";
import { notificationIconMap, LIKE, COMMENT, FOLLOW, NOTIFICATION } from "../server/Var";
import { useState, useEffect } from "react";
import { UIWrapper } from "../components/microComps";
const UserNotifications = ({ Notifications, NewNotifications, socketConn, CountCallback }) => {
	//TODO get notifications from server.
	// if connected we will get everything in realtime. once something happens we ship it to this place if the user is online.
	// if the u is not online we keep everything pending in the server. once connected we send everything..
	
	/*
	NOTIFICATION model {
		"id": v,
		"text": v,
		"type": v,
		"date": v,
		"uuid": v,
		"actor_id": v,
		"seen": v,
		"post_id": v
	}*/

	const [All, setAll] = useState([])
	
	useEffect(() => {

		setAll([...NewNotifications, ...Notifications]);
		
		return () => {
			setAll([]);
		};

	}, [NewNotifications])
	

	useEffect(() => {
		
		setAll([...NewNotifications, ...Notifications]);
		
		return () => {
			setAll([]);
		};

	}, [])

	return (
		<UIWrapper>
			<ul className="border-r-neutral-800 border-l-neutral-800 border-r border-l text-white bg-black my-2 w-full h-screen overflow-y-scroll">
				<h1 className="text-white text-2xl font-bold py-4 w-full text-center border-b border-b-neutral-800"> User notifications </h1>		
				
				{
					
					(All.length > 0) ? (
						All.map((notification, i) => <UserNotificationUI CountCallback={CountCallback} key={i} NotificationOBJ={notification} socketConn={socketConn}/> )
					) : ""
				}
			</ul>	
		</UIWrapper>

	)
}


const UserNotificationUI = ({ NotificationOBJ, socketConn, CountCallback }) => {
	const [notificationObject, setNotificationObject] = useState(NotificationOBJ);

	useEffect(() => {
		return () => {
			setNotificationObject(null);
		}

	}, [])

	const seen = () => {

		const ob = JSON.stringify({

			action: NOTIFICATION,
			code: 200,
			data: { 
				id: notificationObject.id 
			}
		})
		
		if(!Boolean(notificationObject.seen)) {
			setTimeout(() => socketConn.send(ob), 2000);
			notificationObject.seen = 1;
			CountCallback(p => p - 1);
		}
	}

	return (
		(notificationObject) ? (
			<li
				className={`${!Boolean(notificationObject.seen) ? "bg-violet-900 bg-opacity-20" : "bg-black"} cursor-pointer w-full flex flex-row justify-start items-center hover:bg-neutral-900 transition-all hover:bg-opacity-10 border-b border-b-neutral-800 p-4 reveal`}
				onClick={seen}
			> 

				<div className="shadow-xl w-10 rounded-md h-10 bg-slate-900 flex items-center justify-center">
					{ (notificationObject.type in notificationIconMap) ? <Fa icon={notificationIconMap[notificationObject.type].icon} size="sm" className={`${notificationIconMap[notificationObject.type].class_} `}/> : <Fa icon={ faBell } size="sm" className="text-white"/> }	
				</div>
				
				
				<Link to={`/Accounts/${notificationObject.actorid}`} className="flex flex-row items-start mx-6">
					<img className="shadow-xl w-10 rounded-md h-10" src={(notificationObject.User.img) ? notificationObject.User.img : "/img/defUser.jpg"} />			
				</Link>

				<Link to={(notificationObject.type === COMMENT || notificationObject.type === LIKE) ? `/Post/${notificationObject.post_id}` : `/Accounts/${notificationObject.actorid}`}> { notificationObject.text } </Link>

			</li>

		) : ""
	)

}

const UserNotificationUI_ = ({ NotificationOBJ, socketConn, CountCallback }) => {
	const [notificationObject, setNotificationObject] = useState(NotificationOBJ);

	useEffect(() => {
		return () => {
			setNotificationObject(null);
		}

	}, [])

	const seen = () => {

		const ob = JSON.stringify({
			action: NOTIFICATION,
			code: 200,
			data: { 
				id: notificationObject.id 
			}
		})
		
		if(!Boolean(notificationObject.seen)) {
			setTimeout(() => socketConn.send(ob), 2000);
			notificationObject.seen = 1;
			CountCallback(p => p - 1);
		}
	}

	return (
		(notificationObject) ? (
			<li
				className={`${!Boolean(notificationObject.seen) ? "bg-violet-900 bg-opacity-20" : "bg-black"} cursor-pointer w-full flex flex-row justify-start items-center hover:bg-neutral-900 transition-all hover:bg-opacity-10 border-b border-b-neutral-800 p-4 reveal`}
				onClick={seen}
			> 
			
				<Link to={`/Accounts/${notificationObject.actorid}`} className="flex flex-row items-start">
					<img className="shadow-xl w-10 rounded-md h-10" src={(notificationObject.User.img) ? notificationObject.User.img : "/img/defUser.jpg"} />
					{
						(notificationObject.type in notificationIconMap) ? <Fa icon={notificationIconMap[notificationObject.type].icon} size="sm" className={notificationIconMap[notificationObject.type].class_}/> : ""
					}
				</Link>

				<Link to={(notificationObject.type === COMMENT || notificationObject.type === LIKE) ? `/Post/${notificationObject.post_id}` : `/Accounts/${notificationObject.actorid}`} className="mx-6"> { notificationObject.text } </Link>

			</li>

		) : ""
	)

}



export default UserNotifications;















