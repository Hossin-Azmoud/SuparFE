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
import { Retry, UIWrapper } from "../components/microComps";
import { PostFormUI } from "../components/Post"

const Home = ({
	NotificationFunc = () => {},
	funcPoolManager = null,
	NewPosts = [],
	NewLikes = [],
	NewComments = [],
	FlushNewPosts,
	FlushNewComments,
	FlushNewLikes
}) => {
	
	const User = useSelector(state => state.User);
	const [Posts, setPosts] = useState(null);
	const [isLoading, setisLoading] = useState(true);
	


	useEffect(() => {
		
		if(NewPosts.length > 0) {
			// TODO: Clean after consumption.
			if(Posts.length > 0) {
				setPosts(p => [...NewPosts, ...p])	
			} else {
				setPosts(NewPosts)
			}
			
			FlushNewPosts();
		}	
	}, [NewPosts.length])

	useEffect(() => {
		// post_id
		if(NewComments.length > 0) {
			if(Posts.length > 0) {
				var tmp = Posts
				
				NewComments.map(entry => {
					if(tmp[entry.post_id].likes_count === 0) tmp[entry.post_id].post_likes = [];
					tmp[entry.post_id].post_likes.push(entry);
					tmp[entry.post_id].likes_count++;
				})

				setPosts(tmp);
				FlushNewComments();
			}
		}
	}, [NewComments.length])

	useEffect(() => {
		// post_id
		if(NewLikes.length > 0) {
			if(Posts.length > 0) {
				var tmp = Posts
				NewLikes.map(entry => {
					if(tmp[entry.post_id].comments_count === 0) tmp[entry.post_id].post_comments = [];
					tmp[entry.post_id].post_comments.push(entry);
					tmp[entry.post_id].comments_count++;
				})

				setPosts(tmp);
				FlushNewLikes();
			}
		}
	}, [NewLikes.length])

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
	        		
	        		if(Object.keys(Json.data).length > 0) {
	        			var posts = Json.data;
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
		
		if(funcPoolManager) {
			funcPoolManager(
				{ setPosts }
			);
		}
	
		return () => {
			subscribed = false;
			setPosts(null);
		}

	}, []);

	return (	
		<UIWrapper>
       		<PostFormUI setPosts={setPosts} NotificationFunc={NotificationFunc}/>
        	
			<div className="w-full flex-col justify-start items-center pb-14">

         		{
					(Posts && (typeof Posts === "object")) ? (
						Object.values(Posts).reverse().map((v, i) => {
							return (
								<Post 
									Userid_={v.user.id_}
									PostId={v.id}
									UserName={v.user.UserName}
									UserImg={v.user.img}
									PostImg={v.img}
									PostText={v.text}
									CreatedDate={v.date}
									key={v.id}
									NotificationFunc={NotificationFunc}
									PostLikesProp={ (v.post_likes !== null) ? v.post_likes : []}
									PostCommentsProp={ (v.post_comments !== null) ? v.post_comments : [] }
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
			
		</UIWrapper>
	)

}

export default Home;