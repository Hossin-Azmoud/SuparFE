// import SearchPannel from "../UserInterface/SearchPannel";
import {
	faImage, 
	faArrowRight
} from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useState, useEffect, useRef } from "react"
import { useSelector } from 'react-redux';
import { api } from "../Var";
import { convertBase64 } from "../Util/functions";
import { GetAllPosts } from "../Util/serverFuncs";
import Post from "../UserInterface/Post";
import Loader from "../UserInterface/Loader";
import { JWT } from "../Util/functions";


const Home = ({
	NotificationFunc = () => {}
}) => {
	const User = useSelector(state => state.User);
	const [Image, setImage] = useState(null);
	const [Text, setText] = useState("");
	const [rows, setRows] = useState(3);
	const [state, setState] = useState({});
	const [Posts, setPosts] = useState(null);
	const [refresh, setRefresh] = useState(true);
	const [isLoading, setisLoading] = useState(true);
	const textField = useRef(null);

	const resetAll = () => {
		setImage(null);
		setText(null);
		setState(null);
		setPosts(null);
		setRefresh(true);
		textField.current.value = "";
	}

	const countLines = (t) => t.split('\n').length;

	useEffect(() => {
		// TODO count lines in the Text, then set row/line number.
		if(Text) {
			setRows(countLines(Text));
		}

		setState({
			token: JWT,
			uuid: User.id_,
			img: Image,
			text: Text
		});

	}, [Image, Text]);

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
	        			setPosts(Json.data);
	        			// console.table(Json.data)
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
	       		setRefresh(false);
	        	setisLoading(false); 	
	        })
		}
	}

	useEffect(() => {
		var subscribed = true;
		
		FetchPosts(subscribed)

		return () => {
			subscribed = false;
		}

	}, [refresh])

	const OnTypingText = (e) => {
		setText(e.target.value);
	}

	const OpenFileDialogue = (e) => {
		e.preventDefault();
		document.getElementById("image").click()
	};

	const OnImageSelected = (e) => {
		const Files = e.target.files;
		if(Files.length === 1) {
			convertBase64(Files[0])
			.then((Data) => {
				setImage(Data);	
			})
		} else if (Files.length > 1) {
			const FilesData = [];
			for (let i = 0; i < Files.length; i++) {
				convertBase64(Files[i])
				.then((Data) => {
					FilesData.push(Data);	
				})
			}
			setImage(FilesData);
		} else {
			NotificationFunc({
				text: "No images were selected!",
				status: "info"
			});
		}
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
					NotificationFunc({
						text: "Post added!",
						status: "success"
					});
					
					resetAll();
				} else {
					NotificationFunc({
						text: "Could not add your post",
						status: "error"
					});
				}
			}).catch((e) => {
				NotificationFunc({
					text: "could not add post",
					status: "error"
				});
			})
		}

		return;
	}

	return (
		<>
			<div className="flex w-[90%] sm:w-[600px] flex-col justify-start items-start">
				<form className="mt-2 flex rounded py-6 px-2 flex-col justify-center items-start my-2 w-full transition-all">
					<input type="file" id="image" className="hidden" onChange={OnImageSelected}/>
                	<textarea cols="81" rows={rows} ref={textField} onChange={OnTypingText} className="NoBar w-full focus:border-b-sky-700 border-b-neutral-700 border-b resize-none p-3 text-white bg-none px-2 outline-none bg-black p-2" type="text" placeholder="say something" /> 
                	<div className="flex flex-row items-center justify-center mt-2">
                		<button onClick={OpenFileDialogue} title="Attach image" className="text-white p-2 hover:bg-neutral-800 bg-neutral-900 rounded">
              				<p className=""> add image </p>
	              		</button>

						<button onClick={OnSubmit} title="Send post" className="text-white p-2 hover:bg-sky-500 bg-sky-600 rounded mx-2">
		              		<p className=""> post </p>
		              	</button>
                	</div>

            	</form>
            	
            	{
            		(Image) ? (
            			<div className="text-white flex justify-center items-start flex-row flex-wrap p-2">
	            			{
	            				(typeof Image === "string") ? (
	            					<img src={Image} className="rounded-md h-30" alt='imgUploaded' />
	            				) : (
	            				
            						Image.map((v, i) => {
			        					return <img key={i} src={v} className="rounded-md h-24" alt='imgUploaded' />	
            						})
	            				)
	            			}
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