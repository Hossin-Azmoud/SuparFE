import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import { useNotificationSocket } from "../server/socketOps"
import { GetUserById } from "../server/serverFuncs"
import { Link } from "react-router-dom";
import { HOST } from "../server/Var"
// import UserUI from "../components/UserInterfaceComponents/UserUI";

const UserNotifications = () => {
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
	
	const [NewNots, setNewNots] = useState([])
	const User = useSelector(state => state.User);

	const onMessageCallback = (m) => {
		// incoming notifications.
		var New = JSON.parse(m.data)
		var user = {};

		GetUserById(New.actorid, User.id_)
		.then(r => r.json())
		.then(Json => {
			if(Json.code === 200) {
				user = Json.data;
				
				if(HOST) {                    
                    user.img = user.img.replace("localhost", HOST);
                    user.bg = user.bg.replace("localhost", HOST);
	            }

	            
			}
		})
		.finally(() => {
			New.User = user;
			setNewNots([...NewNots, New])
		})
		.catch(e => console.log(e))
	}

	const s = useNotificationSocket(User.id_, onMessageCallback);


	return (
		<>
			<h1 className="text-white text-2xl font-bold"> User notifications </h1>
			<ul className="text-white bg-black rounded p-2 my-2">
				{
					(NewNots.length > 0) ? (
							
						NewNots.map((notification, i) => {
							return (
								<li key={i} className="flex flex-row items-center bg-violet-900 bg-opacity-10 border-b my-1 border-b-white p-3"> 
									<Link to={`/Accounts/${notification.actorid}`}>
										<img className="shadow-xl w-10 rounded-md h-10" src={(notification.User.img) ? notification.User.img : "/img/defUser.jpg"} />
									</Link>

									<p className="mx-6"> { notification.text } </p>
									{ !Boolean(notification.seen) ? <span className="w-2.5 h-2.5 rounded-full bg-orange-500 shadow-xl"> </span> : ""}

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
















