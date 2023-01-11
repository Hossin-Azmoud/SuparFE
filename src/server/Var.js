import { faHeart, faComment, faUserPlus } from "@fortawesome/free-solid-svg-icons";

var api = `http://${location.hostname}:8888/v2`; // Dev 
var HOST = location.hostname;
var socket_base = `ws://${location.hostname}:8888/v2`
var FOLLOW = 0
var LIKE = 1
var COMMENT = 2
var NOTIFICATION = "Notification"

if(HOST === 'localhost') HOST = '';

if(location.port === '8888') {
	api = `/v2` // Production
}

const notificationIconMap = {
	0 : {
		icon: faUserPlus,
		class_: "text-sky-300"
	},
	1 : {
		icon: faHeart,
		class_: "text-rose-500"
	}, 
	2 : {
		icon: faComment,
		class_: "text-sky-300"
	}
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