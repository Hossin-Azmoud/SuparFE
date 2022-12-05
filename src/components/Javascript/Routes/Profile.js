import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { faEdit, faCopy, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { api } from "../Var";
import Post from "../UserInterface/Post";
import { copytoclip as cp, JWT } from "../Util/functions";
import { GetUserById, GetUserPostsById, updateProfileImage, updateBackgroundImage, update } from "../Util/serverFuncs";
import { useParams } from "react-router-dom";
import { Notify, Paragraphs, Iframe } from "../UserInterface/microComps";
import Loader from "../UserInterface/Loader";
import { 
  updateUser
} from '../store/userStore';

const ProfileEditor = () => {
	/*
		TODO:
			! Adjust the Ui to look more modern and appealin
			!! Make it so the user is able to change the bg, img, bio and username.

	*/
	const User = useSelector(state => state.User);	
	

	const [Images, setImages] = useState({
		img: User.img,
		bg: User.bg
	});

	const [bio, setbio] = useState(User.bio);
	const [UserName, setUserName] = useState(User.UserName);

	return (
		<div>

		</div>
	)

}


const ProfileRenderer = ({ User }) => {
	// TODO: Implement Likes..
	// TODO: Implement comments..

	var CurrentUser = useSelector(state => state.User);
	const [Posts, setPosts] = useState(null);
	const [imgCmp, setimgCmp] = useState(false);
	const [Loading, setLoading] = useState(true);
	const [Notification, setNotification] = useState(null);
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
	        			setPosts(Json.data);
	        			// console.table(Json.data);
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
	        	setNotification({
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
			{ (Notification) ? <Notify {...Notification}/> : ""}
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
					<div className="flex flex-col justify-center items-start">
						
						<div className="flex flex-row justify-between items-center text-sm my-2 rounded-md">
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
						
						<div>
							<p> Follwing </p>
							<p> Followers </p>
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

					<div className="flex flex-col justify-center items-center">
						<img onClick={profileImageOnClick} src={User.img} alt="user_avatar" className="rounded-full shadow-xl w-24 h-24 cursor-pointer" />
						{
							(Edit) ? (
								<input ref={UnameRef} onChange={(e) => onInput(e, "UserName")} className="outline-none rounded w-[140px] my-2 text-white inline bg-neutral-700 p-2 border border-neutral-900 focus:border-blue-400"/>
							) : (
								<h5 className="font-semibold my-2 text-lg text-green-400"> { User.UserName } </h5>
							)
						}
					
					</div>

				</section>
	
			</header>
			
			<div className="w-full flex-col justify-start items-center">
				
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

const CurrentUserProfile = () => {
	const User = useSelector(state => state.User);	
	
	return (
		<ProfileRenderer User={User}/>
	)
}

const Account = () => {
	let { id } = useParams();
	
	const [ User, setUser ] = useState()

	useEffect(() => {
		GetUserById(id)
		.then((res) => {
			return res.json()
		})
		.then((Json) => {
			if(Json.code)
			{
				setUser(Json.data);
				console.log(Json.data)
			} else {
				console.log(Json.code)
			}
		}).catch(e => {
			alert(e);
		})
	}, []);

	return (
		(User) ? (<ProfileRenderer 
			User={User}
		/>) : ""
	)
}


export default CurrentUserProfile;
export { 
	Account 
};