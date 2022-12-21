/*
THIS FILE CONTAINS SERVER REQUESTIN FUNCTIONALITY. 
IT AIMS TOWARDS SEPERATING THE UI RENDERING AND THE DATA REQUESTING..
*/

import { api } from "./Var";
import { JWT } from "./functions";


async function GetUserById(id) {
	const response = await fetch(`${api}/${id}`,{
		headers: {
            "content-type": "application/json",
        },
        method: "GET"
	});

    return response;
}

async function GetAllPosts() {
    return await fetch(`${api}/GetAllPosts`, {
        headers: {
        "content-type": "application/json",
        },
        method: "GET"
    })
}

async function DeletePost(UserId, PostId) {
    
    return await fetch(`${api}/DeletePost`, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            token: JWT,
            uuid: UserId,
            id_: PostId 
        })
    })
}

async function getComments(pid) {
   
    const response = await fetch(`${api}/getComments/${pid}`, {
        headers: {
            "content-type": "application/json",
        },

        method: "GET"
    })

    return response;
}

async function getLikes(pid) {
   
    const response = await fetch(`${api}/getLikes/${pid}`, {
        headers: {
            "content-type": "application/json",
        },

        method: "GET"
    })

    return response;
}

async function Comment(post_id, uuid, text) {
    const response = await fetch(`${api}/comment`, {
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
            token: JWT,
            post_id,
            uuid,
            text
        })
    })

    return response;
}


async function Like(post_id, uuid) {
    const response = await fetch(`${api}/like`, {
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
            token: JWT,
            post_id,
            uuid
        })
    })

    return response;
}


async function unLike(post_id, uuid) {
    const response = await fetch(`${api}/like/remove`, {
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
            token: JWT,
            post_id,
            uuid
        })
    })

    return response;
}


async function updateProfileImage(img) {
    
    const response = await fetch(`${api}/update`, {
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
            token: JWT,
            img: img
        })
    })

    return response;
}

async function updateBackgroundImage(img) {
    const response = await fetch(`${api}/update`, {
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        
        body: JSON.stringify({
            token: JWT,
            bg: img
        })
    })

    return response;
}

async function UpdateBio(bio_) {
    const response = await fetch(`${api}/update`, {
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
            token: JWT,
            bio: bio_
        })
    })

    return response;
}

async function update(state) {
    
    if(!("token" in state)) {
        state.token = JWT;
        console.log(JWT);
    }
    
    return await fetch(`${api}/update`, {
        
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        body: JSON.stringify(state)
    })
}

async function updateALL(img_, bg_, bio_, addr_) { 
    const response = await fetch(`${api}/update`, {
        
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
            token: JWT,
            img: img_,
            bg: bg_,
            bio: bio_,
            addr: addr_
        })
    })
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
            T: Token
        })
    })

    return response;
}

async function addFollow(follower_id, followed_id) {
    const response = await fetch(`${api}/follow`, {
        
        headers: {
            "content-type": "application/json",
        },

        method: "POST",

        body: JSON.stringify({
            token: JWT,
            follower_id,
            followed_id
        })

    })

    return response;
}


async function removeFollow(follower_id, followed_id) {
    
    const response = await fetch(`${api}/unfollow`, {

        headers: {
            "content-type": "application/json",
        },

        method: "POST",

        body: JSON.stringify({
            token: JWT,
            follower_id,
            followed_id
        })

    })

    return response;
}


async function GetUserFollowers(uuid) {
    
    const response = await fetch(`${api}/getFollowers/${uuid}`, {

        headers: {
            "content-type": "application/json",
        },

        method: "GET"
    })

    return response;
}

async function GetUserFollowings(uuid) {
    
    const response = await fetch(`${api}/getFollowings/${uuid}`, {

        headers: {
            "content-type": "application/json",
        },

        method: "GET"
    })

    return response;
}


export {
	GetUserById,
	GetUserPostsById,
    SubmitJWT,
    updateProfileImage,
    updateBackgroundImage,
    GetAllPosts,
    update,
    DeletePost,
    getComments,
    getLikes,
    Comment,
    Like,
    unLike,
    addFollow,
    removeFollow,
    GetUserFollowers,
    GetUserFollowings
};
