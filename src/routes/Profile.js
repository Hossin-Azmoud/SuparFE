import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useRef } from 'react';
import { faEdit, faCopy, faLocationDot, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { api, HOST } from "../server/Var";
import Post from "../components/Post";
import { copytoclip as cp, JWT } from "../server/functions";
import { GetUserById, GetUserPostsById, updateProfileImage, updateBackgroundImage, update, GetUserFollowers, GetUserFollowings, removeFollow, addFollow } from "../server/serverFuncs";
import { useParams } from "react-router-dom";
import { Paragraphs, Iframe } from "../components/microComps";
import Loader from "../components/Loader";
import { 
  updateUser
} from '../store/userStore';
import UserUI from "../components/UserUI"
import { Retry } from "../components/microComps";

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
	const [followers, setfollowers] = useState([]);
	const [following, setfollowing] = useState([]);
	const [followersNumber, setfollowersNumber] = useState(0);
	const [followingNumber, setfollowingNumber] = useState(0);
	
	const [InterfaceUsers, setInterfaceUsers] = useState({
		list: [],
		title: ""
	});

	const Dispatch = useDispatch();
	const [followed, setfollowed] = useState(User.isfollowed);

	const follow = () => {
    	// TODO Wanna add an api call.
		if(followed) {
			setfollowed(false);
			removeFollow(CurrentUser.id_, User.id_)
			.then(r => r.json())
			.then(d => {
				if(d.code === 200) {
					console.log(d.data)
				} else {
					setfollowed(p => !p)
				}
			})
			.catch(e => {
				console.log("error: ", e);
			})
		} else {
			setfollowed(true);
			addFollow(CurrentUser.id_, User.id_)
			.then(r => r.json())
			.then(d => {
				if(d.code === 200) {
					console.log(d.data)
				} else {
					setfollowed(p => !p)
				}
			})
			.catch(e => {
				console.log("error: ", e);
			})
		}
		
    	
    	return () => {
    		setfollowed(false)
    	};
    }


	useEffect(() => {
		
		if(Edit) {
			bioRef.current.value = CurrentUser.bio;
			addrRedd.current.value = CurrentUser.addr;
			UnameRef.current.value = CurrentUser.UserName;
		}

	}, [Edit])

	

	const getUsersData = (idArray, callback) => {
		
		let tempArray = [];
		let Data;
		if(idArray.length > 0) {
			for (var i = 0; i < idArray.length; i++) {
				GetUserById(idArray[i], CurrentUser.id_)
				.then(req => req.json())
				.then(j => {
					if(j.code === 200 && j.data != null) {
						Data = j.data
					} else {
						alert(j.data)
					}
				})
				.finally(() => {
					tempArray.push(Data)
					if(tempArray.length === idArray.length){
						callback(tempArray)
					}
				})
				.catch(e => console.log("error accured while fetching user."))
			}
		}

	}

	const Fetchfollowers = () => {
		GetUserFollowers(User.id_)
		.then(r => r.json())
		.then(json => {
			if (json.code === 200) {
				if(json.data != null) {
					const identifiers = json.data;
					setfollowersNumber(identifiers.length);
					getUsersData(identifiers, setfollowers);
				}
			}
		})

		.catch(e => {
			NotificationFunc({
    		msg: "could not get the followers. try again..",
    		StyleKey: "error"
    	})
	  })
	}

	const Fetchfollowings = () => {
		GetUserFollowings(User.id_)
		.then(r => r.json())
		.then(json => {
			if (json.code === 200) {
				if(json.data != null) {
					const identifiers = json.data;
					setfollowingNumber(identifiers.length)
					getUsersData(identifiers, setfollowing);
				}
			}
		})
		.catch(e => {
			NotificationFunc({
    		msg: "could not get the following, try again.",
    		StyleKey: "error"
    	})
	  })
	}

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

	const visualize = (a, title) => {
		if(a.length > 0) {

			if(HOST) {
				a.map(v => {
					v.img = v.img.replace("localhost", HOST)
				})
      	}

			setInterfaceUsers({list: a, title});
		}
	}

	useEffect(() => {
		console.log("followers: ", followers.length)
		console.log("following: ", following.length)
	}, [followers, following])

	useEffect(() => {
		
		var subscribed = true;
	
		if(subscribed) {
			FetchUserPosts(subscribed);
			if(!Loading) setLoading(true);
		 	Fetchfollowers()
		 	Fetchfollowings()
			setLoading(false);
		}

		return () => {
			subscribed = false
			setLoading(false);
		}

	}, [setfollowers, setfollowers]);


	
	return (

		<div className="w-[90%] sm:w-[600px] flex flex-col justify-start items-start">
			
			{ (imgCmp) ? <Iframe Obj={{ onclick: setimgCmp, variables: imgCmp }} /> : "" }
			<header className="border border-neutral-700 rounded-b-xl bg-neutral-800 flex flex-col justify-center items-center md:w-[80%] w-full mx-auto shadow-white shadow-sm">
				
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
						 		) : (
									<button className={`font-semibold p-2 text-white shadow-md rounded duration-50 mx-2 ${ (!followed) ? " hover:bg-sky-400 bg-sky-500" : "bg-slate-900 border border-white" }`} onClick={follow}>
											{ (followed) ? "unfollow" : "follow" }
									</button>
						 		) 
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


						<div className="flex flex-row flex-wrap my-4"> 

							<p onClick={() => visualize(followers, `${User.UserName}\'s followers`)} className="border border-neutral-700 cursor-pointer bg-neutral-900 shadow-2xl rounded px-4 py-1 text-white font-thin text-md"> followers <span> { followersNumber } </span> </p>
							<p onClick={() => visualize(following, `${User.UserName}\'s followings`)} className="border border-neutral-700 cursor-pointer bg-neutral-900 shadow-2xl rounded px-4 py-1 mx-4 text-white font-thin text-md"> following <span> { followingNumber } </span> </p>

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

					<div className="w-[30%] flex flex-col justify-center rounded px-4 py-2 items-center">
						<img 
							onClick={profileImageOnClick} 
							src={User.img} 
							alt="user_avatar"
							style={{
								boxShadow: "10px 10px 100px -10px rgba(0, 0, 0, .5)",
							}}
							className="hover:rounded-md duration-[2s] transition-all ease-in-out rounded-full shadow-lg w-full cursor-pointer w-28" 
						/>
					
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
									CreatedDate={v.date}
									key={i}
								/>
							)
						})

					) : (
						<div className="text-white flex flex-col justify-center items-center h-24">							
							{	
								(Loading) ? ( <Loader /> ) : (
									(typeof Posts === "string") ? (
										<p className="text-white"> { Posts } </p>
									) : ( <Retry func={FetchUserPosts}/> )
								)
							}
						</div>
					)
				}
			</div>

			{/* a frame to visualize things in the ui. */}

			{
				(InterfaceUsers.list.length > 0) ? (
					<div className="overflow-y-scroll pt-12 border rounded border-sky-400 w-[90%] md:w-[500px] h-[600px] fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black">
						
						<div className="left-0 top-0 w-full flex items-center shadow-xl justify-between p-3 bg-sky-900 fixed">
							
							<button onClick={() => setInterfaceUsers({ list:[], title: "" })} className="p-4 rounded-full flex justify-center items-center h-[30px] w-[30px]">
								<Fa icon={faClose} className="text-white" size="lg" />
							</button>
							<h1 className="text-white"> {InterfaceUsers.title} </h1>
						</div>
						
						<div className="flex flex-col items-center justify-center mt-5">
							{
								InterfaceUsers.list.map((v, i) => {
									
									return  <UserUI
                      CurrUserId_={User.id_}
                      id_={v.id_}
                      img={v.img}
                      UserName={v.UserName}
                      key={i}
                      Followed={v.isfollowed}
                  />

								})
							}
						</div>
					</div>
				) : ""
			}
			
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
	var CurrentUser = useSelector(state => state.User);
	const [ User, setUser ] = useState()
	
	useEffect(() => {

		GetUserById(id, CurrentUser.id_)
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