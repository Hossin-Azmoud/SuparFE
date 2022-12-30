
import { FontAwesomeIcon as Fa } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { notificationIconMap } from "../server/Var";
import { useState, useEffect } from "react"
const UserNotifications = ({ Notifications, NewNotifications }) => {
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
		<>
		
			<ul className="border-r-neutral-800 border-l-neutral-800 border-r border-l text-white bg-black my-2 w-full sm:w-[600px] h-screen">
				<h1 className="text-white text-2xl font-bold py-4 w-full text-center border-b border-b-neutral-800"> User notifications </h1>		
				
				{
					
					(All.length > 0) ? (
						All.map((notification, i) => {
							return (
								<li key={i} 
									className={`${!Boolean(notification.seen) ? "bg-sky-900 bg-opacity-10" : "bg-black"} cursor-pointer w-full flex flex-row justify-start items-center hover:bg-neutral-900 transition-all hover:bg-opacity-10 border-b border-b-neutral-800 p-4 reveal`}> 
									
									<Link to={`/Accounts/${notification.actorid}`} className="flex flex-row items-start">
										<img className="shadow-xl w-10 rounded-md h-10" src={(notification.User.img) ? notification.User.img : "/img/defUser.jpg"} />
										
										{
											(notification.type in notificationIconMap) ? <Fa icon={notificationIconMap[notification.type]} size="sm" className="text-white relative z-30 -left-3 -top-0 shadow"/> : ""
										}

									</Link>
										
									<p className="mx-6"> { notification.text } </p>
	

								</li>
							)	
						})
						
					) : ""
				}
			</ul>	
		</>
	)
}


export default UserNotifications;
















