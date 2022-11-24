const SetAuthCookie = (T, ExpirationDays = 365) => {
	if(T) {
		let Date_ = new Date();
		Date_.setTime(Date_.getTime() + ExpirationDays * 24 * 60 * 60 * 1000);
		const expires = `; expires=${Date_.toUTCString()}`;
    	document.cookie = `AccessToken=${ T }${ expires }; path=/;`;
    	console.log(`AccessToken=${ T }${ expires }; path=/;`)
    	return document.cookie;
	} 

	alert("Token was expected from Function `SetAuthCookie`");
};


const getJwtAuthToken = (key = "AccessToken") => {
    
    var cookies = document.cookie.split(';')[0];  
    var [CookieKey, CookieValue] = cookies.split("=");

    if(CookieKey === key) 
    	return CookieValue;
    
    return false;
}



function RemoveJWT() {   
    document.cookie = 'AccessToken=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;';
}


var JWT = getJwtAuthToken();



const convertBase64 = (file) => {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.readAsDataURL(file);

        fileReader.onload = () => {
            resolve(fileReader.result);
       	};

        fileReader.onerror = (error) => {
            reject(error);
        };
    });
};

const copytoclip = (T) => navigator.clipboard.writeText(T);


export { 
	SetAuthCookie, 
	getJwtAuthToken, 
	JWT, 
	RemoveJWT, 
	convertBase64,
	copytoclip
};