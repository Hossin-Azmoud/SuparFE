import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { faEdit, faCopy, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { api } from "../Var";
import Post from "../UserInterface/Post";
import { copytoclip as cp } from "../Util/functions";
import { GetUserById, GetUserPostsById } from "../Util/serverFuncs";
import { useParams } from "react-router-dom";
import { Paragraphs, IMFrame } from "../UserInterface/microComps";


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
	const [Posts, setPosts] = useState(null);
	const [imgCmp, setimgCmp] = useState(null);

	useEffect(() => {

		console.log(Object.keys(User));
		GetUserPostsById(User.id_)
		.then((res) => {
            return res.json()
        })

		.then((data) => {
        	if(data.code == 200) {
        		setPosts(data.data);
        	}
        })

	}, []);

	
	return (

		<div className="w-[90%] sm:w-[600px] flex flex-col justify-start items-start">
			{(imgCmp) ? <IMFrame img={imgCmp} /> : ""}
			<header className="bg-slate-800 flex flex-col justify-center items-center w-full">
				
				<img src={User.bg} alt="background" className="w-full border-b border-b-white"/>
				<section className="p-2 flex flex-row justify-between items-start my-4 w-full rounded-xl">
					


					<div className="flex flex-col justify-center items-start">
						<p className="cursor-pointer flex flex-row justify-between items-center text-sm my-2 rounded-md text-green-400 shadow-lg p-2 font-semibold bg-black">
						 	<p> ID: #{ User.id_ } </p>
						 	
						</p>
						<div>
							<Paragraphs Text={User.bio} Class="font-normal text-sky-100 text-slate-200 text-base my-1"/>
						</div>

						<p className="text-sky-600 font-thin my-2">
							<Fa icon={ faLocationDot } className="text-white"/> <span className="mx-2"> { User.addr } </span>
						</p>

					</div>

					<div className="flex flex-col justify-center items-center">
						<img onClick={() => {
							setimgCmp(User.img);
						}} src={User.img} alt="user_avatar" className="rounded-full shadow-xl w-24 h-24 cursor-pointer" />
						<h5 className="font-semibold my-2 text-lg text-green-400"> { User.UserName } </h5>
					</div>

				</section>
	
			</header>
			
			<div className="w-full flex-col justify-start items-center">
				{
					(Posts) ? (
						Posts.map((v, i) => {
							return (
								
								<Post 
									Userid_={User.id_}
									UserName={User.UserName}
									UserImg={User.img}
									PostImg={v.IMG}
									PostText={v.Text}
									key={i}
								/>

							)
						})
						
					) : (
						<h1 className="text-white "> No Posts yet. </h1>
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
		}).catch((e) => {
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