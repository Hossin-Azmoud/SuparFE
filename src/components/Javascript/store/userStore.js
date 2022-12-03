import { createSlice, configureStore } from '@reduxjs/toolkit';
import { 
	SetAuthCookie, 
	RemoveJWT 
} from '../Util/functions';

const UserSlice = createSlice({
	name: 'Auth',
	
	initialState: {
		User: false
	},
	
	reducers: {

		login: (state, action) => {
			// Gets the token using the payload.
			state.User = action.payload;
			if(action.payload.Token) {
				SetAuthCookie(action.payload.Token);
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
			state.value = null;
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

