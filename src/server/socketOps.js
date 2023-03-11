import { socket_base, SEENMESSAGE, NOTIFICATION } from "./Var";

const NotEndPoint = "/WSoc"

const useSocket = (uuid, callback) => {
	const socketUrl = `${socket_base}${NotEndPoint}`

	var s = new WebSocket(socketUrl);

	s.onopen = () => {
		console.log("Connected to socket at: ", socketUrl)
		s.send(uuid)
		console.log("Id was sent :)")
	}
	s.onmessage = callback;
	s.onclose = () => console.log("socket at", socketUrl ,"closed")
	s.onerror = (e) => console.log("socket at ", socketUrl, "had an error", e)
	
	return s;
}

const SendSeenSignal = (Conn, action, Object_, CountCallback=null) => {
	
	const ob = JSON.stringify({
		action,
		code: 200,
		data: { 
			id: Object_.id
		}
	})
		
	if(!Boolean(Object_.seen)) {

		var t = setTimeout(() => Conn.send(ob), 2000);
		clearTimeout(t);

		Object_.seen = 1;

		if(CountCallbac) {
			CountCallback(p => p - 1);
		}
		
	}
}

const sendSeenMessage = (Conn, Message, CountCallback=null) => SendSeenSignal(Conn, SEENMESSAGE, Message, CountCallback);

const sendSeenNotification = (Conn, NotificationObject, CountCallback=null) => SendSeenSignal(Conn, NOTIFICATION, NotificationObject, CountCallback);


export {
	useSocket,
	sendSeenMessage,
	sendSeenNotification
};