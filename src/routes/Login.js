
import { api } from "../server/Var";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { SetAuthCookie } from "../server/functions";
import { 
    login,
    logout
} from '../store/userStore';
import { Link, useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import Logo from "../components/Logo";
import { isEmail } from "./validation";

const Login = ({ 
	NotificationFunc = () => {}
}) => {
	const User = useSelector(state => state.User);
	const dispatch = useDispatch()
	const [Loading, setLoading] = useState(false);
	const [state, setState] = useState({
		Email: "",
		Password: ""
	});
	
	const navigate = useNavigate();
	const validators = document.getElementsByClassName("validator");
	const setErrorContent = (index, text) => validators[index].textContent = text;
	
	const ChangeState = (e, key) => {
		const NewState = state;
		
		const tmp     = e.target.value;
		NewState[key] = tmp.trim();
		e.target.value = tmp;
		
		setState(NewState);
	}

	const submitData = (e) => {
		e.preventDefault();
		var Problematics = [];
		setLoading(true);
		
		Object.keys(state).map((k, i) => {
			const v = state[k];
			
			
			
			switch(k) {
				case "Email":
					if(!isEmail(v))    Problematics.push({index: i, errMsg: "invalid email! please try another."});
					break;
				
				case "Password":
					if(v.length < 6)   Problematics.push({index: i, errMsg: "password must be atleast 6 characters long.."});
					break;

				default:
					if(!v) {
						Problematics.push({ index: i, errMsg: "This field can not be empty!!" })
						return
					}
			}
		});

		if(Problematics.length === 0) {
			fetch(`${api}/login`, {
				headers: {
					"content-type": "application/json",
				},
				method: "POST",
				body: JSON.stringify(state)
			})

			.then((res) => {
				return res.json()
			})

			.then((Json) => {
				
				if(Json.code === 200) {
					dispatch(login(Json.data));
					NotificationFunc({
						text: "Welcome to your account, " + Json.data.UserName + "!",
						status: "info"
					});
				} else {
					console.log(Json)
					
					NotificationFunc({
						text: Json.data,
						status: "error"
					});
				}
			})
			.catch((e) => {
				NotificationFunc({
					text: Json.data,
					status: "error"
				});
			})
		} else {
			Problematics.map(v => {
				setErrorContent(v.index, v.errMsg)
			});
		}

		setLoading(false);
	}

	return (
		<div className="w-screen h-screen flex flex-col justify-center items-center">
			<form 
				className="w-[90%] flex flex-col md:flex-row justify-between items-center w-11/12 md:w-[700px] rounded-md bg-neutral-900 border-slate-800 border blue-shadow"
			>	
				<div className="flex flex-row justify-center items-center bg-black md:h-full rounded p-4 w-full">
					<Logo class_="w-48"/>	
				</div>
				

				<div className="flex flex-col w-full justify-center p-4 px-6">
					
					<label className="my-1 w-full flex flex-col justify-center items-start text-white ">
						Email
						<input onChange={(e) => ChangeState(e, "Email")} className="bg-neutral-600 py-2 px-2 w-full outline-none my-2 rounded text-white" type="email" placeholder="Example@mail.com" />
						<p className="validator text-red-600 text-sm font-normal"></p>
					</label>
					
					<label className="my-1 w-full flex flex-col justify-center items-start text-white">
						password
						<input onChange={(e) => ChangeState(e, "Password")} name="Password" className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="password" id="Password" placeholder="Better be secure tho :)" />
						<p className="validator text-red-600 text-sm font-normal"></p>
					</label>
					<Link to="/Signup" className="my-3 text-sm font-normal text-sky-200 p-2 hover:underline hover:text-sky-500"> don't have an account yet? let's help you make one. </Link>
					<div className="flex flex-row justify-start items-center">
						<button onClick={submitData} className="hover:bg-blue-700 bg-blue-900 transition-all duration-500 my-2 w-[100px] rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md">
							submit
						</button>
						
						{
							(Loading) ? (
								<span className="ml-6"> 
									<Loader />
								</span>
							) : ""
						}

					</div>
				</div>
			</form>
		</div>
	)
}


export default Login;









