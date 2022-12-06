import "./CustomStyles/Animations.css";
import Loader from "../UserInterface/Loader";
import UserUI from "../UserInterface/UserUI";
import { api } from "../Var";
import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { 
    login
} from '../store/userStore';
import { useNavigate } from "react-router-dom";
import { faCloudUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome'
import { convertBase64 } from "../Util/functions";

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

	const validators = document.getElementsByClassName("validator");
	const setErrorContent = (index, text) => validators[index].textContent = text;

	const ChangeState = (e, key) => {
		
		const NewState = state;
		if(e.target.value) {
			NewState[key] = e.target.value;
			setState(NewState);
			console.log(NewState);
		}

	}

	useEffect(() => {
		console.log(state);
	}, [state]);

	const submitData = (e) => {
		setLoading(true);
		e.preventDefault();
		var Problematics = [];
		Object.keys(state).map((k, i) => {
			
			if(!state[k]) {
				if(isReq(k)) {
					Problematics.push({index: i, errMsg: "This field can not be empty!!"})
					return	
				}
			}

		});

		

		if(Problematics.length === 0) {
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
		} else {
			Problematics.map((v) => {
				setErrorContent(v.index, v.errMsg)
			});
		}
		setLoading(false);
	}

	return (
		<div className="w-full h-screen flex flex-col justify-center items-center">
			{
				(Index === 0) ? (
					<form className="slideRight w-[90%] flex flex-row justify-between items-center w-11/12 sm:w-[700px] rounded-md shadow-md bg-neutral-900">
						<div className="flex w-full sm:w-1/2 flex-col justify-center p-4 px-6">
							<h1 className="text-xl font-semibold text-sky-200 my-3"> Make an account using you Email. </h1>
							<p className="my-2 text-sky-100 text-normal"> Required are marked with <span className="text-red-300"> * </span> </p>
							
							<label className="my-1 w-full flex flex-col justify-center items-start text-white">
								<p> User Name  <span className="text-red-300"> * </span> </p>
								<input onChange={(e) => ChangeState(e, "UserName")} name="Password" className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="text" placeholder="John doe"></input>
								<p className="validator text-red-600 text-sm font-normal"></p>
							</label>
		
							<label className="my-1 w-full flex flex-col justify-center items-start text-white">
								<p> Email <span className="text-red-300"> * </span> </p>
								<input onChange={(e) => ChangeState(e, "Email")} className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="email" placeholder="Example@mail.com"></input>
								<p className="validator text-red-600 text-sm font-normal"></p>
							</label>
							
							<label className="my-1 w-full flex flex-col justify-center items-start text-white">
								<p> password  <span className="text-red-300"> * </span> </p>
								<input onChange={(e) => ChangeState(e, "Password")} name="Password" className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="password" id="Password" placeholder="Better be secure tho :)"></input>
								<p className="validator text-red-600 text-sm font-normal"></p>
							</label>
		
							<button onClick={() => { setIndex(1) }} className="hover:bg-blue-700 bg-blue-900 transition-all duration-500 my-2 w-[100px] rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md">
								Next
							</button>
						</div>
						<img src="/img/sculp.jpg" className="sm:w-[250px] hidden sm:block rounded-r-md rounded-xl" alt="Image" />
					</form>
				) : (
					
					<form className="slideLeft p-4 sm:w-[400px] w-[90%] flex flex-col justify-start items-start w-11/12 sm:w-[700px] rounded-md shadow-md bg-neutral-900">
						
						<input type="file" id="img" className="hidden" onChange={OnImgSelected} />
						<input type="file" id="bg" className="hidden" onChange={OnbgSelected} />
	
						<label className="my-1 resize-none w-full flex flex-col justify-center items-start text-white">
								<p> User Bio <span className="text-red-300"> * </span> </p>
								<textarea onChange={(e) => ChangeState(e, "bio")} name="Bio" className="bg-neutral-600 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 rounded text-white" type="text" placeholder="Tell us about you!!"></textarea>
								<p className="validator text-red-600 text-sm font-normal"></p>
						</label>
						
						<button onClick={(e) => {
							OpenFileDialogue(e, "img")}} className="w-full bg-transparent border border-white transition-all duration-500 my-2 rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md">
							
							<div>
								upload avatar
								<Fa icon={faCloudUpload} className="ml-4" />
							</div>
							{
								(img) ? (
									
									<UserUI
		                                id_="001"
		                                img={img}
		                                UserName="User 001" 
                            		/>
								) : ""
							}

						</button>

						<button onClick={(e) => {OpenFileDialogue(e, "bg")}} className="w-full bg-transparent border border-white transition-all duration-500 my-2 rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md flex-col justify-center items-center flex">
							
							<div>
								upload Background image
								<Fa icon={faCloudUpload} className="ml-4" />
							</div>
							{
								(bg) ? (
									<img src={bg} className="rounded m-4 shad" />
								) : ""
							}

						</button>

						<div >
							<button className="hover:bg-blue-700 bg-blue-900 transition-all duration-500 my-2 w-[100px] rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md" onClick={() => {setIndex(0)}}>
								previous
							</button>
							<button onClick={submitData} className="hover:bg-blue-700 bg-blue-900 transition-all duration-500 my-2 w-[100px] rounded border-box py-2 px-4 text-white cursor-pointer hover:shadow-md mx-2">
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
