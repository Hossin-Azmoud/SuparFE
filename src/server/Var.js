import { faHeart, faComment } from "@fortawesome/free-solid-svg-icons";

var goApi = `http://${location.hostname}:5000`;
var api = `http://${location.hostname}:8888/v2`; // Dev 
var HOST = location.hostname;
var socket_base = `ws://${location.hostname}:8888/v2`

if(HOST === 'localhost') HOST = '';

if(location.port === '8888') {
	api = `/v2` // Production
}

const notificationIconMap = {
	1 : faHeart, 
	2 : faComment
}

export { 
	api, 
	goApi,
	HOST,
	socket_base,
	notificationIconMap
};