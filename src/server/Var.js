import { faHeart, faComment, faUserPlus } from "@fortawesome/free-solid-svg-icons";

var api = `http://${location.hostname}:8888/v2`; // Dev 
var HOST = location.hostname;
var socket_base = `ws://${location.hostname}:8888/v2`
const FOLLOW = 0
const LIKE = 1
const COMMENT = 2
const NOTIFICATION = "Notification"

if(HOST === 'localhost') HOST = '';

if(location.port === '8888') {
	api = `/v2` // Production
}

const notificationIconMap = {
	FOLLOW : faUserPlus,
	LIKE : faHeart, 
	COMMENT : faComment
}

export { 
	api,
	HOST,
	socket_base,
	notificationIconMap,
	LIKE,
	COMMENT,
	FOLLOW,
	NOTIFICATION
};