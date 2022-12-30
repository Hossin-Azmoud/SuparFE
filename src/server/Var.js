import { faHeart, faComment, faUserPlus } from "@fortawesome/free-solid-svg-icons";

var api = `http://${location.hostname}:8888/v2`; // Dev 
var HOST = location.hostname;
var socket_base = `ws://${location.hostname}:8888/v2`

if(HOST === 'localhost') HOST = '';

if(location.port === '8888') {
	api = `/v2` // Production
}

const notificationIconMap = {
	0 : faUserPlus,
	1 : faHeart, 
	2 : faComment
}

export { 
	api,
	HOST,
	socket_base,
	notificationIconMap
};