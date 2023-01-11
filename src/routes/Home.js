// import SearchPannel from "../UserInterface/SearchPannel";
import {
	faImage, 
	faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useRef } from "react"
import { useSelector } from 'react-redux';
import { api } from "../server/Var";
import { GetAllPosts } from "../server/serverFuncs";
import Post from "../components/Post";
import Loader from "../components/Loader";
import { JWT } from "../server/functions";
import { HOST } from "../server/Var";
import { Link } from "react-router-dom";
import { Retry } from "../components/microComps";
import { PostFormUI } from "../components/Post"

const Home = ({
	NotificationFunc = () => {},
	funcPoolManager
}) => {
	
	const User = useSelector(state => state.User);
	const [Posts, setPosts] = useState(null);
	const [isLoading, setisLoading] = useState(true);
	const FetchPosts = (isSubscribed) => {
		if(isSubscribed) {
				
			if(!isLoading){
				setisLoading(true);
			}

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

	        			setPosts(posts);

	        		} else {
	        			setPosts("No posts to display.");
	        		}
	        		
	        	} else { 
	        		NotificationFunc({
						text: "Could not get posts from the server",
						status: "error"
					});
	        	}
	        }).catch(() => {
	        	NotificationFunc({
					text: "Error accured.",
					status: "error"
				});
	        }).finally(() => {
	        	setisLoading(false); 	
	        })
		}
	}

	useEffect(() => {
		var subscribed = true;
		FetchPosts(subscribed);
		funcPoolManager({ setPosts });

		return () => {
			subscribed = false;
			setPosts(null);
		}
	}, [])

	return (
		<>
			<div className="flex w-[90%] sm:w-[600px] flex-col justify-start items-start">
				            	
           		<PostFormUI setPosts={setPosts} NotificationFunc={NotificationFunc}/>
            	
				<div className="w-full flex-col justify-start items-center pb-14">

	         		{
						(Posts && (typeof Posts === "object")) ? (
							Posts.map((v, i) => {
								return (
									<Post 
										Userid_={v.user.id_}
										PostId={v.id}
										UserName={v.user.UserName}
										UserImg={v.user.img}
										PostImg={v.img}
										PostText={v.text}
										key={i}
										NotificationFunc={NotificationFunc}
									/>
								)
							})
							
							) : (
								<div className="text-white flex flex-col justify-center items-center h-24">
									{ (isLoading) ? <Loader /> : (typeof Posts === "string") ? <p className="text-white"> { Posts } </p> : <Retry func={FetchPosts}/> }
								</div>
							)
					}

				</div>
			</div>

		</>
	)

}

export default Home;