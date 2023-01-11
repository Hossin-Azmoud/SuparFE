
async function Post(EndPoint, Payload) {
     const response = await fetch(EndPoint, {
        headers: {
            "content-type": "application/json",
        },
        method: "POST",
        body: JSON.stringify(Payload)
    })

    return response;
}

async function Get(EndPoint) {
     const response = await fetch(EndPoint, {
        headers: {
            "content-type": "application/json",
        },
        method: "GET"
    })

    return response;
}

export {
    Get, Post
};