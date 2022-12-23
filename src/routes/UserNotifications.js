import { useEffect, useState } from "react"
import { useSelector } from 'react-redux';
import { useNotificationSocket } from "../server/socketOps"

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
	
	const [Nots, setNots] = useState([])
	const User = useSelector(state => state.User);

	useEffect(() => {
		
		var s = useNotificationSocket(User.id_);

		s.onmessage = (msg) => {
			console.log(msg.data)
		}
		
		s.onclose = () => {
			console.log("Closed the socket connection...")
		}

	}, [])

	

	return (
		<h1 className="text-white text-2xl font-bold"> User notifications. </h1>
	)
}


export default UserNotifications;
















