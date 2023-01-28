import { useSelector, useDispatch } from 'react-redux';
import {
	logout
} from "../store/userStore";
import { useEffect, useState } from 'react';
import { faHouse, faMessage, faUserFriends, faSignOut, faUsers, faCog, faBell  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from "react-router-dom";

// Guts@gmail.com
const NavBar = ({ UserImg, NewNotificationCount, NewMsgCount}) => {
	
	const [MessagesCount, setMCount] = useState(NewMsgCount);
	const [NotificationsCount, setNCount] = useState(NewNotificationCount);


	
	useEffect(() =>  {
		setNCount(NewNotificationCount);
		setMCount(NewMsgCount);
	}, [NewNotificationCount, NewMsgCount])

	const dispatch = useDispatch();
	const redirect_ = useNavigate();
	
	const signOut = () => {
		dispatch(logout());
		redirect_("/");
	}

	const ClickedLink = (e) => { 
		// const Links = [
		// 	...document.getElementsByClassName("link")
		// ];
		
		// for(var i = 0; i < Links.length; i++) {
		// 	const v = Links[i];
			
		// 	v.classList.add("text-white");
		// 	v.classList.remove("text-yellow-300");
		// }

		// e.target.classList.add("text-yellow-300");
	}

	return (
		<aside className="overflow-x-hidden w-full border-t-white border-t sm:border-none fixed bottom-0 left-0 sm:h-full sm:w-24 w-full flex sm:flex-col flex-row justify-around sm:bg-transparent bg-black items-center py-4 transition-all z-10">

			<Link onClick={ClickedLink} to="/profile" className="link"> 
				<img src={(UserImg) ? UserImg : "/img/defUser.jpg"} className="w-6 rounded-md hover:ring"/>
			</Link>
			
			<Link onClick={ClickedLink} to="/Accounts" className="link">
				<Fa icon={ faUsers } className="ease-in-out transition-all text-white" size="lg"/>
			</Link>
			
			<Link onClick={ClickedLink} to="/Home" className="link">
				<Fa icon={ faHouse } className="ease-in-out transition-all text-white" size="lg"/>
			</Link>	

			<Link onClick={ClickedLink} to="/Notifications" className="flex items-start justify-start link"> 

				<Fa icon={ faBell } className="ease-in-out transition-all text-white" size="lg"/>
				{
					(NotificationsCount > 0) ?  <span className="border-2 border-black p-2 flex z-30 items-center justify-center -top-1 right-2.5 rounded-full relative bg-sky-500 my-auto mx-auto text-white w-2.5 h-2.5 text-center" style={{ fontSize: "9px" }}> { NotificationsCount } </span> : ""
				}

			</Link>
			
			<Link onClick={ClickedLink} to="/chat" className="flex items-start justify-start link"> 
				<Fa icon={ faMessage } className="ease-in-out transition-all transition-all text-white" size="lg"/>
				{
					(MessagesCount > 0) ?  <span className="border-2 border-black p-2 flex z-30 items-center justify-center -top-1 right-2.5 rounded-full relative bg-sky-500 my-auto mx-auto text-white w-2.5 h-2.5 text-center" style={{ fontSize: "9px" }}> { MessagesCount } </span> : ""
				}
			</Link>

			<Fa onClick={signOut} icon={ faSignOut } className="cursor-pointer hover:text-blue-500 transition-all text-white" size="lg"/>

		</aside>
	)
};

export default NavBar;