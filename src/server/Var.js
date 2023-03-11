import { faHeart, faComment, faUserPlus } from "@fortawesome/free-solid-svg-icons";

var   api          	= `http://${location.hostname}:8888/v2`; // Dev 
var   HOST         	= location.hostname;
var   socket_base  	= `ws://${location.hostname}:8888/v2`
const FOLLOW        = 0
const LIKE          = 1
const COMMENT       = 2
const NOTIFICATION  = 3
const NEWPOST       = 4
const MSG           = 5
const SEENMESSAGE   = 6

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

if(HOST === 'localhost') HOST = '';

if(location.port === '8888') {
	api = `/v2` // Production
}

export { 
	api,
	HOST,
	socket_base,
	notificationIconMap,
	LIKE,
	COMMENT,
	FOLLOW,
	NOTIFICATION,
	NEWPOST,
	MSG,
	SEENMESSAGE
}