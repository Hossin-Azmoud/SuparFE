import { createSlice, configureStore } from '@reduxjs/toolkit';
import { 
	SetAuthCookie, 
	RemoveJWT 
} from '../server/functions';

const UserSlice = createSlice({
	name: 'Auth',
	
	initialState: {
		User: false
	},
	
	reducers: {

		login: (state, action) => {
			// Gets the token using the payload.
			state.User = action.payload;
			console.log("Login signaled!");
			if(action.payload.token) {
				// console.log()
				SetAuthCookie(action.payload.token);
			}
		},

		updateUser: (state, action) => {
			//doc: update a field.
			console.log(action.payload)
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

