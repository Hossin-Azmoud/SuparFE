/*
THIS FILE CONTAINS SERVER REQUESTIN FUNCTIONALITY. 
IT AIMS TOWARDS SEPERATING THE UI RENDERING AND THE DATA REQUESTING..
*/

import { api } from "../Var";
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
    console.table({
        token: JWT,
        uuid: UserId,
        id_: PostId 
    })
    
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

// const CDN = "http://localhost:8500"

// async function AddAvatarToCDN(img) {
    
//     const response = await fetch(`${CDN}/Zimg/addAvatar`, {
//         headers: {
//             "content-type": "application/json",
//         },

//         method: "POST",
//         body: JSON.stringify({
//             mime: img,
//             id: uuid
//         })
//     })

//     return response;
// }


// async function AddBackgroundToCDN(img) {
    
//     const response = await fetch(`${CDN}/Zimg/addbg`, {
//         headers: {
//             "content-type": "application/json",
//         },

//         method: "POST",
//         body: JSON.stringify({
//             mime: img,
//             id: uuid
//         })
//     })

//     return response;
// }

// async function AddBackgroundToCDN(img) {
    
//     const response = await fetch(`${CDN}/Zimg/NewPostImg`, {
//         headers: {
//             "content-type": "application/json",
//         },

//         method: "POST",
//         body: JSON.stringify({
//             mime: img,
//             id: uuid,
//             postID: PID
//         })
//     })

//     return response;
// }

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


export {
	GetUserById,
	GetUserPostsById,
    SubmitJWT,
    updateProfileImage,
    updateBackgroundImage,
    GetAllPosts,
    update,
    DeletePost
};





