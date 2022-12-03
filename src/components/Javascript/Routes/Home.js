// import SearchPannel from "../UserInterface/SearchPannel";
import {
	faImage, 
	faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect } from "react"
import { useSelector } from 'react-redux';
import { api } from "../Var";
import { convertBase64 } from "../Util/functions";
import { GetAllPosts } from "../Util/serverFuncs";
import Post from "../UserInterface/Post";
import Loader from "../UserInterface/Loader";
import { Notify } from "../UserInterface/microComps";
import { JWT } from "../Util/functions";

const Home = () => {
	const User = useSelector(state => state.User);
	
	const [Image, setImage] = useState(null);
	const [Text, setText] = useState("");
	const [state, setState] = useState({});
	const [Posts, setPosts] = useState(null);
	const [refresh, setRefresh] = useState(true);
	const [Notification, setNotification] = useState(null);
	const [isLoading, setisLoading] = useState(true);
	const resetAll = () => {
		setImage(null);
		setText(null);
		setState(null);
		setPosts(null);
		setRefresh(true);
	}

	useEffect(() => {
		
		setState({
			token: JWT,
			uuid: User.id_,
			img: Image,
			text: Text
		});

		console.log(state)

	}, [Image, Text]);

	const FetchPosts = () => {
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
        			setPosts(Json.data);
        		} else {
        			setPosts("No posts to display.");
        		}
        		
        	} else { 
        		setNotification({
					text: "Could not get posts from the server",
					status: "error"
				});
        	}
        }).catch(() => {
        	setNotification({
				text: "Error accured.",
				status: "error"
			});
        }).finally(() => {
       		setRefresh(false);
        	setisLoading(false); 	
        })
	}

	useEffect(() => {
		FetchPosts()
	}, [refresh])

	const OnTypingText = (e) => {
		setText(e.target.value);
	}

	const OpenFileDialogue = () => {
		document.getElementById("image").click()
	};


	const OnImageSelected = (e) => {
		const type_ = e.target.files[0].type;
		convertBase64(e.target.files[0])
		.then((Data) => {
			setImage(Data);	
		})
	}

	const OnSubmit = (e) => {
		e.preventDefault();
		
		if(state.text || state.img) {
			fetch(`${api}/NewPost`, {
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
					setNotification({
						text: "Post added!",
						status: "success"
					});
					resetAll();
				} else {
					setNotification({
						text: "Could not add your post",
						status: "error"
					});
				}
			}).catch((e) => {
				setNotification({
					text: "could not add post",
					status: "error"
				});
			})
		}
		
		return;
	}

	return (
		<>
			{(Notification) ? <Notify msg={Notification.text} StyleKey={Notification.status}/> : ("")}

			<div className="flex w-[90%] sm:w-[600px] flex-col justify-start items-start">
				<form className="mt-2 flex rounded p-5 flex-row justify-center items-center my-2 w-full border border-neutral-600 transition-all">
					<input type="file" id="image" className="hidden" onChange={OnImageSelected}/>

                	<textarea onChange={OnTypingText} className="resize-none p-3 rounded-md text-white bg-none px-2 w-full outline-none bg-black p-2" type="text" placeholder="say something"> 
                	</textarea>
                	
                	<div className="flex flex-row items-center justify-center">
                		
                		<span onClick={OpenFileDialogue} title="Attach image" className="p-1 flex justify-center items-center rounded-full h-[35px] w-[40px] duration-50 cursor-pointer mx-2 hover:bg-slate-800">
              				<FontAwesomeIcon icon={faImage} className="text-white" size="xs"/>
	              		</span>

						<span onClick={OnSubmit}
							title="Send post" className="p-1 flex justify-center items-center rounded-full h-[35px] w-[40px] duration-50 cursor-pointer mx-2 hover:bg-slate-800">
		              		<FontAwesomeIcon icon={faArrowRight} className="text-white" size="xs"/>
		              	</span>

		              
                	</div>

            	</form>
            	
            	{
            		(Image) ? (
            			<div className="text-white flex justify-center items-start flex-row flex-wrap">
            				<img src={Image} className="rounded-md h-20" alt='imgUploaded'/>
            			</div>
            		) : ""
            	}
            	
				<div className="w-full flex-col justify-start items-center">

	         		{
						(Posts && (typeof Posts === "object")) ? (
							Posts.map((v, i) => {
								return (
									<Post 
										Userid_={v.user.id_}
										UserName={v.user.UserName}
										UserImg={v.user.img}
										PostImg={v.img}
										PostText={v.text}
										key={i}
									/>
								)
							})
							
							) : (
								<div className="text-white flex flex-col justify-center items-center h-24">
									{
										(isLoading) ? (<Loader />) : (
										
												(typeof Posts === "string") ? (
													<p className="text-white"> { Posts } </p>

												) : (
													<>
														<h1 className="my-2"> Failed to load data! </h1>
														<button
															className="hover:text-slate-700 hover:bg-white p-2 bg-neutral-900 rounded-md"
															onClick={FetchPosts}
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

		</>
	)

}


export default Home;
/*
POST rendering:

*/











