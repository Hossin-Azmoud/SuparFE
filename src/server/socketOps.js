import { socket_base } from "../server/Var";
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

export {
	useSocket
};