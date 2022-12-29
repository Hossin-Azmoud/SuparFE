
var goApi = `http://${location.hostname}:5000`;
var api = `http://${location.hostname}:8888/v2`; // Dev 
var HOST = location.hostname;
var socket_base = `ws://${location.hostname}:8888/v2`

if(HOST === 'localhost') HOST = '';

if(location.port === '8888') {
	api = `/v2` // Production
}

export { 
	api, 
	goApi,
	HOST,
	socket_base
};