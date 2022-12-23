import { api } from "../server/Var";
const SocketEndPoint = `${api}/NotificationSock`

const useNotificationSocket = (uuid) => {
	const socketUrl = SocketEndPoint.replace("http", "ws")
	var s = new WebSocket(socketUrl);

	s.onopen = () => {
		console.log("Connected to socket at: ", socketUrl)
		s.send(uuid)
		console.log("Id was sent :)")
	}

	s.onclose = () => console.log("socket at", socketUrl ,"closed")
	s.onerror = (e) => console.log("socket at ", socketUrl, "had an error", e)
	
	return s;
}

export {
	useNotificationSocket
};