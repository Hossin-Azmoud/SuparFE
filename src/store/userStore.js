import { createSlice, configureStore } from '@reduxjs/toolkit';
import { 
	SetAuthCookie, 
	RemoveJWT 
} from '../server/functions';
import { GetUserFollowers } from "../server/serverFuncs";

const UserSlice = createSlice({
	name: 'Auth',
	
	initialState: {
		User: false,
		followers: false
	},
	
	reducers: {

		login: (state, action) => {
			// Gets the token using the payload.
			// state.User = action.payload;
			state.followers = [];

			GetUserFollowers(action.payload.id_)
			.then(r => {
				return r.json()
			})
			.then(json => {
				
				if(json.code === 200) {
					console.log(json)
					if(json.data != null) {
						state.followers = json.data;
					}
				}

			})

			if(action.payload.token) {
				SetAuthCookie(action.payload.token);
			}

			state.User = action.payload;
		},

		// unfollow: (state, action) => {

		// },

		// follow: (state, action) => {

		// },

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
		}

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
