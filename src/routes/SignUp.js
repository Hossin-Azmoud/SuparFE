import "./CustomStyles/Animations.css";
import Loader from "../components/Loader";
import UserUI from "../components/UserUI";
import { api } from "../server/Var";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { 
    login
} from '../store/userStore';

import { useNavigate } from "react-router-dom";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome'
import { convertBase64 } from "../server/functions";
import { isEmail } from "./validation";

const noop = () => {}

const SignUp = ({
	NotificationFunc = () => {}
}) => {


	const navigate = useNavigate();
	const dispatch = useDispatch()
	const [Index, setIndex] = useState(0);
	const [img, setImg] = useState(null);
	const [bg, setbg] = useState(null);
	const [Loading, setLoading] = useState(false);
	
	const isReq = (k) => (k === "UserName") || (k === "Email") || (k === "Password") || (k === "bio");
	
	const [state, setState] = useState({
		UserName: "",
		Email: "",
		Password: "",
		bio: ""
	});

	const validators = document.getElementsByClassName("validator");
	
	const setErrorContent = (index, text) => {
		if(index < validators.length){
			validators[index].textContent = text	
		}
	};

	const Prev = (e) => { 
		e.preventDefault();
		setIndex(0);
	}

	const Next = (e) => {
		// TODO: Check if all field in the first slide are valid.
		e.preventDefault();
		var Problematics = [];
		var val;
		

		Object.keys(state).map((k, i) => setErrorContent(i, "")); // Clear prev errors.
		Object.keys(state).map((k, i) => {
			if(i > 3) return;
			
			val = state[k];
			console.log(k, ": ", val);
			
			switch(k) {
				case "Email":
					if(!isEmail(val))    Problematics.push({index: i, errMsg: "invalid email! please try another."});
					break;
				
				case "UserName":
					if(val.length < 3)   Problematics.push({index: i, errMsg: "User name must be atleast 3 characters long.."});
					break;

				case "Password":
					if(val.length < 6)   Problematics.push({index: i, errMsg: "password must be atleast 6 characters long.."});
					break;

				default:
					if(val.length === 0) Problematics.push({index: i, errMsg: "This field can not be empty!!"});
					break;
			}
		});

		if(Problematics.length > 0) {
			
			Problematics.map((v) => {
				setErrorContent(v.index, v.errMsg);
			});

			return;
		}
		
		setIndex(1);
	}

	const OpenFileDialogue = (e, id) => {
		e.preventDefault();
		document.getElementById(id).click();
	};

	const OnImgSelected = (e) => {
		setLoading(true);
		const type_ = e.target.files[0].type;
		convertBase64(e.target.files[0])
		.then((Data) => {
			setImg(Data);
			setState({...state, img: Data})
		})
		.catch(() => {
			NotificationFunc({ 
				text: "profile image could not be uploaded!",
				status: "error"
			});
		})
		setLoading(false);
	}
	
	const OnbgSelected = (e) => {
		setLoading(true);
		const type_ = e.target.files[0].type;
		
		convertBase64(e.target.files[0])
		.then((Data) => {
			setbg(Data);
			setState({...state, bg: Data});
		})
		.catch(() => {
			NotificationFunc({ 
				text: "background image could not be uploaded!",
				status: "error"
			});
		})

		setLoading(false);
	}

	const ChangeState = (e, key) => {
		e.preventDefault();
		const tmp = e.target.value;
		const NewState = state;
		e.target.value = tmp;
		NewState[key]  = tmp.trim();
		setState(NewState);
	}

	useEffect(() => {
		
		if(Index === 0) {
			const keys = Object.keys(state);
			for (var i = 0; i < keys.length; i++) {
				if(i === 4) break;
				let k = keys[i];
				var e = document.getElementById(k)
				
				if(e !== null) {
					e.value = state[k];	
				}
			}
		}

	}, [Index]);

	const submitData = (e) => {
		
		setLoading(true);
		e.preventDefault();		
		fetch(`${api}/signup`, {
			headers: {
				"content-type": "application/json",
			},
			method: "POST",
			body: JSON.stringify({
				...state
			})
		}).then((res) => {
			return res.json()
		}).then((Json) => {
		

			if(Json.code === 200) {
				dispatch(login(Json.data));
				
				NotificationFunc({ 
					text: "Welcome to your account " + Json.data.UserName + "!",
					status: "success"
				});

				navigate("/");
				location.reload();
			} else {
				NotificationFunc({ 
					text: Json.data,
					status: "error"
				});
			}
		}).catch((e) => {
			NotificationFunc({ 
				text: "an error accured and you could not sign in!",
				status: "error"
			});
		})
		
		setLoading(false);
	}

	return (
		<div className="w-full h-screen flex flex-col justify-center items-center">
			{
				(Index === 0) ? (
					<form className="slideRight blue-shadow w-[90%] flex flex-row justify-between items-center w-11/12 sm:w-[600px] rounded-md bg-neutral-900" onSubmit={noop} >
						<div className="flex w-full flex-col justify-center p-4 px-6">
							<h1 className="text-xl font-semibold text-sky-200 my-3"> Make an account using you Email. </h1>
							<p className="my-2 text-sky-100 text-normal"> Required are marked with <span className="text-red-300"> * </span> </p>
							
							<label htmlFor="UserName" className="my-1 w-full flex flex-col justify-center items-start text-white">
								<p> User Name  <span className="text-red-300"> * </span> </p>
								<input onChange={(e) => ChangeState(e, "UserName")} id="UserName" name="Password" className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="text" placeholder="John doe" />
								<p className="validator text-red-600 text-sm font-normal"></p>
							</label>
		
							<label htmlFor="Email" className="my-1 w-full flex flex-col justify-center items-start text-white">
								<p> Email <span className="text-red-300"> * </span> </p>
								<input onChange={(e) => ChangeState(e, "Email")} id="Email" className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="email" placeholder="Example@mail.com" />
								<p className="validator text-red-600 text-sm font-normal"></p>
							</label>
							
							<label htmlFor="Password" className="my-1 w-full flex flex-col justify-center items-start text-white">
								<p> password  <span className="text-red-300"> * </span> </p>
								<input onChange={(e) => ChangeState(e, "Password")} id="Password" name="Password" className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="password" id="Password" placeholder="Better be secure tho :)" />
								<p className="validator text-red-600 text-sm font-normal"></p>
							</label>
							
							<label htmlFor="bio" className="my-1 resize-none w-full flex flex-col justify-center items-start text-white">
								<p> User Bio <span className="text-red-300"> * </span> </p>
								<textarea onChange={(e) => ChangeState(e, "bio")} id="bio" name="Bio" className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="text" placeholder="Tell us about you!!"></textarea>
								<p className="validator text-red-600 text-sm font-normal"></p>
							</label>

							<button onClick={ Next } className="hover:bg-blue-700 bg-blue-900 transition-all duration-500 my-2 w-[100px] rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md">
								Next
							</button>
						</div>
					</form>
					
				) : (
					<form className="transition-all duration-500 blue-shadow slideLeft p-4 sm:w-[400px] w-[90%] flex flex-col justify-start items-start w-11/12 sm:w-[700px] rounded-md bg-neutral-900 origin-left" onSubmit={noop}>
						
						<input type="file" id="img" className="hidden" onChange={OnImgSelected} />
						<input type="file" id="bg" className="hidden" onChange={OnbgSelected} />
						<button onClick={(e) => {
							OpenFileDialogue(e, "img")}} className="w-full bg-transparent border border-white my-2 rounded flex flex-col gap-4 justify-center items-center border-box py-2 px-4 text-white cursor-pointer hover:shadow-md">
							
							<div>
								upload avatar
								<Fa icon={faCloudUpload} className="ml-4" />
							</div>
							{
								(img) ? (
									<UserUI
		                                id_="001"
		                                img={img}
		                                UserName={state.UserName}
		                                class_="border border-slate-800 p-4"
                            		/>
								) : ""
							}

						</button>

						<button onClick={(e) => {OpenFileDialogue(e, "bg")}} className="w-full bg-transparent border border-white my-2 rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md flex-col justify-center items-center flex">
							
							<div>
								upload Background image
								<Fa icon={faCloudUpload} className="ml-4" />
							</div>
							{
								(bg) ? (
									<img src={bg} className="rounded m-4 shadow w-64" />
								) : ""
							}

						</button>

						<div >
							
							<button className="hover:bg-blue-700 bg-blue-900 my-2 w-[100px] rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md" onClick={ Prev }>
								previous
							</button>

							<button onClick={submitData} className="hover:bg-blue-700 bg-blue-900 my-2 w-[100px] rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md mx-2">
								submit
							</button>
							{
								(Loading) ? (
									<Loader />	
								) : ""								
							}
						</div>
						
					</form>

				)	
			}
		</div>
	)
}


export default SignUp;
