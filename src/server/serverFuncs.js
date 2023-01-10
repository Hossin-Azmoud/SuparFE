/*
THIS FILE CONTAINS SERVER REQUESTIN FUNCTIONALITY. 
IT AIMS TOWARDS SEPERATING THE UI RENDERING AND THE DATA REQUESTING..
*/

import { api } from "./Var";
import { JWT } from "./functions";
import { useSelector, useDispatch } from 'react-redux';


async function Poster(EndPoint, Payload) {
     const response = await fetch(EndPoint, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(Payload)
    })

    return response;
}


async function Getter(EndPoint, Payload) {
     const response = await fetch(EndPoint, {
        headers: {
            "content-type": "application/json",
        },
        method: "GET"
    })

    return response;
}

const NewPostArrow = async (state) => await Poster(`${api}/NewPost`, state);

async function NewPost(state) {

    const response = await fetch(`${api}/NewPost`, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            ...state,
            token: JWT,
        })
    })

    return response;
}

async function GetUserById(id, CurrentLoggedUserId) {
    const response = await fetch(`${api}/getUser?uuid=${id}&user=${CurrentLoggedUserId}`,{
		headers: {
            "content-type": "application/json",
        },
        method: "GET"
	});

    return response;
}

async function getPostById(post_id) {
    //TODO: change this endpoint to => v2//:pid
    const response = await fetch(`${api}/getPostById/${post_id}`, {
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

   
    const response = await fetch(`${api}/getPostCommentsById/${pid}`, {
        headers: {
            "content-type": "application/json",
        },

        method: "GET"
    })

    return response;
}
async function getLikes(pid) {
   
    const response = await fetch(`${api}/getPostLikesById/${pid}`, {
        headers: {
            "content-type": "application/json",
        },

        method: "GET"
    })

    return response;
}

async function Comment(post_id, uuid, text, PostOwnerId) {
    const response = await fetch(`${api}/comment`, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
            token: JWT,
            post_owner_id: PostOwnerId,
            post_id,
            uuid,
            text
        })
    })

    return response;
}

async function Like(post_id, uuid, PostOwnerId) {
    const response = await fetch(`${api}/like`, {
        headers: {
            "content-type": "application/json",
        },

        method: "POST",
        body: JSON.stringify({
            token: JWT,
            post_owner_id: PostOwnerId,
            post_id,
            uuid,

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

async function GetUserNotifications(uuid) {
    const response = await fetch(`${api}/getUserNotifications/${uuid}`, { 
        headers: { "content-type": "application/json" }, 
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
    getPostById,
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
    GetUserFollowings,
    NewPost,
    GetUserNotifications
};
