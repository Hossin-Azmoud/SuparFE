/*
THIS FILE CONTAINS SERVER REQUESTIN FUNCTIONALITY. 
IT AIMS TOWARDS SEPERATING THE UI RENDERING AND THE DATA REQUESTING..
*/

import { api } from "./Var";
import { JWT } from "./functions";
import { Post, Get } from "./requests";

const NewPost = async (state) => await Post(`${api}/NewPost`, { ...state, token: JWT });
const GetAllPosts = async () => await Get(`${api}/GetAllPosts`);
const GetUserById = async (id, CurrentLoggedUserId) => await Get(`${api}/getUser?uuid=${id}&user=${CurrentLoggedUserId}`);
const getPostById = async (post_id) => await Get(`${api}/getPostById/${post_id}`);
const DeletePost = async (UserId, PostId) => await Post(`${api}/DeletePost`, { token: JWT, uuid: UserId, id_: PostId });
const getComments = async (pid) => await Get(`${api}/getPostCommentsById/${pid}`)
const getLikes = async (pid) => await Get(`${api}/getPostLikesById/${pid}`)
const Comment = async (post_id, uuid, text, PostOwnerId) => await Post(`${api}/comment`, { token: JWT, post_owner_id: PostOwnerId, post_id, uuid, text });
const Like = async (post_id, uuid, PostOwnerId) => await Post(`${api}/like`, { token: JWT, post_owner_id: PostOwnerId, post_id, uuid })
const unLike = async (post_id, uuid) => await Post(`${api}/like/remove`, { token: JWT, post_id, uuid });
const updateProfileImage = async (img) => await Post(`${api}/update`, { token: JWT,img: img });
const updateBackgroundImage = async (img) => await Post(`${api}/update`, { token: JWT, bg: img });
const UpdateBio = async (bio_) => await Post(`${api}/update`, { token: JWT, bio: bio_ })
const update = async (state) => await Post(`${api}/update`, { ...state, token: JWT })
const updateALL = async (img_, bg_, bio_, addr_)  => await Post(`${api}/update`, { token: JWT, img: img_, bg: bg_, bio: bio_, addr: addr_ });
const GetUserPostsById = async (id) => await Get(`${api}/getUserPosts?id_=${id}`);
const SubmitJWT = async (Token) => await Post(`${api}/login`, { T: Token });
const addFollow = async (follower_id, followed_id) => await Post(`${api}/follow`, { token: JWT, follower_id, followed_id });
const removeFollow = async (follower_id, followed_id) => await Post(`${api}/unfollow`, { token: JWT, follower_id, followed_id });
const GetUserFollowers = async (uuid) => await Get(`${api}/getFollowers/${uuid}`);
const GetUserFollowings = async (uuid) => await Get(`${api}/getFollowings/${uuid}`);
const GetUserNotifications = async (uuid) => await Get(`${api}/getUserNotifications/${uuid}`);

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
