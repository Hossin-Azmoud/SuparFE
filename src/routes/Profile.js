import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { faEdit, faCopy, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { api, HOST } from "../server/Var";
import Post from "../components/UserInterfaceComponents/Post";
import { copytoclip as cp, JWT } from "../server/functions";
import { GetUserById, GetUserPostsById, updateProfileImage, updateBackgroundImage, update } from "../server/serverFuncs";
import { useParams } from "react-router-dom";
import { Paragraphs, Iframe } from "../components/UserInterfaceComponents/microComps";
import Loader from "../components/UserInterfaceComponents/Loader";
import { 
  updateUser
} from '../store/userStore';

const ProfileRenderer = ({ 
	User,
	NotificationFunc = () => {}	
}) => {
	// TODO: Implement Likes..
	// TODO: Implement comments..

	var CurrentUser = useSelector(state => state.User);
	const [Posts, setPosts] = useState(null);
	const [imgCmp, setimgCmp] = useState(false);
	const [Loading, setLoading] = useState(true);
	const [Edit, setEdit] = useState(false)
	const [bioRef, addrRedd, UnameRef] = [useRef(null), useRef(null), useRef(null)]	
	const [EditState, setEditState] = useState({})
	const Dispatch = useDispatch();

	useEffect(() => {
		
		if(Edit) {
			bioRef.current.value = CurrentUser.bio;
			addrRedd.current.value = CurrentUser.addr;
			UnameRef.current.value = CurrentUser.UserName;
		}

	}, [Edit])

	const profileImageOnClick = () => {
		if(CurrentUser.id_ === User.id_) {
			setimgCmp({
				img: User.img,
				Editable: true,
				payload: updateProfileImage,
				uuid: CurrentUser.id_,
				Updatekey: "img"
			})
		} else {
			setimgCmp({
				img: User.img,
				Editable: false
			})
		}			
	}

	const backGroundImageOnClick = () => {
		if(CurrentUser.id_ === User.id_) {
			setimgCmp({
				img: User.bg,
				Editable: true,
				payload: updateBackgroundImage,
				uuid: CurrentUser.id_,
				Updatekey: "bg"
			});
		} else {
			setimgCmp({
				img: User.bg,
				Editable: false
			});	
		}
	}

	const SaveChanges = (e) => {
		// Set the token then ship the changes.
		e.preventDefault();
		var state = EditState;
		state.token = JWT;
		console.log(JWT);
		
		update(state)
		.then((res) => {
			return res.json()
		})

		.then(Json => {
			if(Json.code === 200) {	
				Dispatch(updateUser(state))
			} else {
				console.log(Json)
			}
		})
		.catch(e => {
			console.log(e)
		})
		.finally(() => {
			setEdit(false);
		})
	}

	const onInput = (e, key) => {
		var temp = EditState;
		temp[key] = e.target.value;
		setEditState(temp)
	}

	const ToggleEdit = () => setEdit(true)

	const FetchUserPosts = (subscribed) => {
		
		if(!Loading) setLoading(true);

		if(subscribed) {
			GetUserPostsById(User.id_)
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

	        			setPosts(posts);

	        		} else {
	        			setPosts("No posts yet.");
	        		}
	        	} else if (Json.code == 500) {
	        		setPosts(Json.data);
	        	}
	        })
	        .finally(() => {
	        	setLoading(false);
	        })
	        .catch(e => {
	        	NotificationFunc({
	        		msg: `an error accured while getting data: ${e}`,
	        		StyleKey: "error"
	        	})
	        })	
		}
	}

	useEffect(() => {
		
		var subscribed = true;
		
		FetchUserPosts(subscribed);
		
		return () => {
			subscribed = false
		}

	}, []);

	
	return (

		<div className="w-[90%] sm:w-[600px] flex flex-col justify-start items-start">
			
			{ (imgCmp) ? <Iframe Obj={{ onclick: setimgCmp, variables: imgCmp }} /> : "" }
			<header className="rounded-b-xl bg-neutral-800 flex flex-col justify-center items-center w-full">
				
				<div 
					className="h-28 w-full cursor-pointer"
					
					style={{
						backgroundImage: (User.bg) ? `url(${User.bg})` : "url(/img/defUser.jpg)",
						backgroundPosition: "center",
						backgroundSize: "cover",
						backgroundRepeat: "no-repeat"
					}}

					onClick={backGroundImageOnClick}
				>

				</div>

				<section className="px-4 flex flex-row justify-between items-start my-4 w-full">
					<div className="flex flex-col justify-between items-start w-[70%]">
						
						<div className="flex flex-row justify-start items-center text-sm my-2 rounded-md">
						 	<p className="p-2 font-semibold bg-black text-green-400 shadow-lg rounded "> ID: #{ User.id_ } </p>
						 	{
						 		(CurrentUser.id_ === User.id_) ? (
						 			<button onClick={ToggleEdit} className="cursor-pointer hover:bg-sky-400 text-white mx-2  rounded bg-sky-500 p-2">
						 				Edit
						 			</button>
						 		) : "" 
						 	}
						</div>

						<div>
							{
								Edit ?  (
									<textarea ref={bioRef} onInput={(e) => onInput(e, "bio")} rows="10" cols="35" className="rounded outline-none text-white inline bg-neutral-700 p-2 border border-neutral-900 focus:border-blue-400"></textarea>
								) : (
									<Paragraphs Text={User.bio} Class="w-[300px] font-normal text-sky-100 text-slate-200 text-base my-1"/>
								)
							}
							
						</div>
						


						<p className="text-sky-600 font-thin my-2">
							
							{
								Edit ? (
									<input ref={addrRedd} onChange={(e) => onInput(e, "addr")} className="outline-none rounded text-white inline bg-neutral-700 p-2 border border-neutral-900 focus:border-blue-400"/>
								) : (
									<>
										<Fa icon={ faLocationDot } className="text-white"/>
										<span className="mx-2"> { User.addr } </span>
									</>
								)
							}
						</p>
					
						{	
							(Edit) ? (
								<div>
									<button onClick={SaveChanges} className="cursor-pointer shadow hover:bg-sky-600 bg-sky-500 text-white rounded p-2">
										save changes
									</button>
									
									<button onClick={() => {setEdit(false)}} className="cursor-pointer shadow bg-rose-700 mx-3 text-white rounded p-2">
										Cancel
									</button>
								</div>
							) : ""
						}

					</div>

					<div className="w-[30%] flex flex-col justify-center items-center">
						<img onClick={profileImageOnClick} src={User.img} alt="user_avatar" className="rounded-full shadow-lg hover:ring shadow-xl w-full cursor-pointer" />
					
						{
							(Edit) ? (
								<input ref={UnameRef} onChange={(e) => onInput(e, "UserName")} className="outline-none rounded w-full my-2 text-white inline bg-neutral-700 p-2 border border-neutral-900 focus:border-blue-400"/>
							) : (
								<h5 className="font-semibold my-2 text-normal text-green-200"> { User.UserName } </h5>
							)
						}
					
					</div>

				</section>
	
			</header>
			
			<div className="w-full flex-col justify-start items-center pb-14">
				
				{
					(Posts && (typeof Posts === "object")) ? (
						Posts.map((v, i) => {
							return (
								<Post 
									Userid_={User.id_}
									PostId={v.id}
									UserName={User.UserName}
									UserImg={User.img}
									PostImg={v.img}
									PostText={v.text}
									key={i}
								/>
							)
						})

					) : (
						<div className="text-white flex flex-col justify-center items-center h-24">
							{
								(Loading) ? (<Loader />) : (
								
									(typeof Posts === "string") ? (
										<p className="text-white"> { Posts } </p>

									) : (
										<>
											<h1 className="my-2"> Failed to load data! </h1>
											<button
												className="hover:text-slate-700 hover:bg-white p-2 bg-neutral-900 rounded-md"
												onClick={FetchUserPosts}
											>
												try again
											</button>
										</>
									)
								)
							}
						</div>
						
					)
				}
			</div>
		</div>


	)
}

const CurrentUserProfile = ({
	NotificationFunc=() => {}
}) => {
	const User = useSelector(state => state.User);	
	return (
		<ProfileRenderer NotificationFunc={NotificationFunc} User={User}/>
	)
}

const Account = ({
	NotificationFunc = () => {}
}) => {
	let { id } = useParams();
	
	const [ User, setUser ] = useState()
	useEffect(() => {
		GetUserById(id)
		.then((res) => {
			return res.json()
		})
		.then((Json) => {
			if(Json.code){
				var U =  Json.data;
			    
			    if(HOST) {
    				U.img = U.img.replace("localhost", HOST);
    				U.bg = U.bg.replace("localhost", HOST);
    			}

				setUser(U);
			} else {
			}
		}).catch(e => {
			alert(e);
		})
	}, []);

	return (
		(User) ? (<ProfileRenderer 
			User={ User }
			NotificationFunc={NotificationFunc}
		/>) : ""
	)
}


export default CurrentUserProfile;
export { 
	Account 
};