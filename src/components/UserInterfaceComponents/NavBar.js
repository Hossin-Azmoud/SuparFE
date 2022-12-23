import { useSelector, useDispatch } from 'react-redux';
import {
	logout
} from "../../store/userStore";

import { useEffect, useState } from 'react';
import { faHouse, faUserFriends, faSignOut, faUsers, faCog, faBell  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { Link, useNavigate } from "react-router-dom";

// Guts@gmail.com
const NavBar = ({ UserImg }) => {
	const dispatch = useDispatch();
	const redirect_ = useNavigate();
	
	const signOut = () => {
		dispatch(logout());
		redirect_("/");
	}



	return (
		<aside className="overflow-x-hidden w-full border-t-white border-t sm:border-none fixed bottom-0 left-0 sm:h-full sm:w-24 w-full flex sm:flex-col flex-row justify-around sm:bg-transparent bg-black items-center py-4 transition-all">

			<Link to="/profile">
				<img src={(UserImg) ? UserImg : "/img/defUser.jpg"} className="w-6 rounded-md hover:ring"/>
			</Link>
			
			<Link to="/Accounts">
				<Fa icon={ faUsers } className="hover:text-blue-500 transition-all text-white" size="md"/>
			</Link>
			
			<Link to="/Home">
				<Fa icon={ faHouse } className="hover:text-blue-500 transition-all text-white" size="md"/>
			</Link>		

			<Link to="/Notifications">
				<Fa icon={ faBell } className="hover:text-blue-500 transition-all text-white" size="md"/>
			</Link>


			<Fa onClick={signOut} icon={ faSignOut } className="cursor-pointer hover:text-blue-500 transition-all text-white" size="md"/>

		</aside>
	)
};


export default NavBar;