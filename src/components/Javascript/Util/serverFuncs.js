/*
THIS FILE CONTAINS SERVER REQUESTIN FUNCTIONALITY. 
IT AIMS TOWARDS SEPERATING THE UI RENDERING AND THE DATA REQUESTING..
*/

import { api } from "../Var";

async function GetUserById(id) {
	const response = await fetch(`${api}/${id}`,{
		headers: {
            "content-type": "application/json",
        },
        method: "GET"
	});

    return response;
}


async function GetUserPostsById(id) {
	const response = await fetch(`${api}/getUserPosts?id_=${id}`, {
        headers: {
            "content-type": "application/json",
        },
        method: "GET"
    })

    return response;
}

async function SubmitJWT(Token) {
    const response = await fetch(`${api}/login`, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            AccessToken: Token
        })
    })

    return response;
}


export {
	GetUserById,
	GetUserPostsById,
    SubmitJWT
};
