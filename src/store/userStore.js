import { createSlice, configureStore } from '@reduxjs/toolkit';
import { 
	SetAuthCookie, 
	RemoveJWT
} from '../server/functions';
import { GetUserFollowers, GetUserPostsById, GetAllPosts } from "../server/serverFuncs";
import { HOST } from "../server/Var";
/*
todo:
	For this file we need to make our state more shareable.. and we need a certain archetecture to
	controll the flow and mutation of data.
	Data that will be managed by state and socket calls:
		
		[] Notifications..
		[] Posts
		[*] User

		[] Messages (Not implemented in the backend tho so we need to implement this bit)

		TODO Queue: {
			Posts, 
			Notifications
		}.

	FetchPosts: (state, action) => {
			// TODO: Get posts and share them accross the app..
				action = {
					callback: function,
					notificationFunc: function,
					id: int
				}

				This pool will have three branches/Types of post arrays.
				1. My posts.
				2. received and fetched posts...
				3. Some(uuid) Posts...
				It is like a cache.
				
				Data form:
					{
						uuid -> []Post
						all -> []Post
						current -> []post
					}

				dispatching a change action will result in mutating the state, 
				we will look for the user's post.. 
				change likes/comments and even add posts or delete posts.

			
			
			if(action.payload.id) {
				GetUserPostsById(action.payload.id)
				.then(res => {
		            return res.json()
		        })

		        .then(Json => {
		        	if(Json.code == 200) {
		        		if(Json.data) {
		        			
		        			var posts = Json.data;
		        			
		        			if(HOST) {
		        				posts.map((v, i) => {
									v.img = v.img.replace("localhost", HOST)
		        				})
		        			}

		        			state.PostPool[action.payload.id] = posts;

		        		} else {
		        			state.PostPool[action.payload.id] = "No posts yet.";
		        		}
		        	} else if (Json.code == 500) {
		        		action.payload.NotificationFunc({
							text: "Could not get posts from the server",
							status: "error"
						});
		        	}
		        })

		        .finally(() => {
		        	action.payload.callback();
		        })

		        .catch(e => {
		        	NotificationFunc({
		        		msg: `an error accured while getting data: ${e}`,
		        		StyleKey: "error"
		        	})
		        })	
			} else {
				GetAllPosts()
		        .then((res) => {
		            return res.json()
		        })
		        
		        .then((Json) => {
		        	if(Json.code == 200) {
		        		if(Json.data.length > 0) {
		        			var posts = Json.data;
		        			
		        			if(HOST) {
		        				posts.map((v, i) => {
		        					v.user.img = v.user.img.replace("localhost", HOST)
									v.img = v.img.replace("localhost", HOST)
		        				})
		        			}

		        			state.PostPool["posts"] = posts;

		        		} else {
		        			state.PostPool["posts"] = "No posts to display.";
		        		}
		        		
		        	} else { 
		        		action.payload.NotificationFunc({
							text: "Could not get posts from the server",
							status: "error"
						});
		        	}
		        }).catch((e) => {
		        	
		        	action.payload.NotificationFunc({
						text: `Error accured. ${e}`,
						status: "error"
					});

		        }).finally(() => {
		        	if(action.payload.callback) action.payload.callback();
		        })
			}	
		}
*/

const UserSlice = createSlice({
	
	name: 'Auth',
	initialState: {
		User: false
	},
	
	reducers: {

		login: (state, action) => {
			// Gets the token using the payload.
			// state.User = action.payload;
			if(action.payload.token) {
				SetAuthCookie(action.payload.token);
			}

			state.User = action.payload;

		},
		
		updateUser: (state, action) => {
			// doc: update a field.
			Object.keys(state.User).map(k => {
				if(k in action.payload) {
					state.User[k] = action.payload[k];
				}
			})
		},

		logout: state => {
			state.User = null;
			RemoveJWT();
		},
	}
});

export const { 
	logout, 
	login,
	updateUser
} = UserSlice.actions;

export default configureStore({
	reducer: UserSlice.reducer
});
