import { useSelector, useDispatch } from 'react-redux';
import {
	logout
} from "../store/userStore";

import { useEffect, useState } from 'react';
import { faHouse, faUserFriends, faSignOut, faUsers, faCog  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";

// Guts@gmail.com
const NavBar = ({ UserImg }) => {

	const dispatch = useDispatch();
	const signOut = () => {
		dispatch(logout());
		console.log("Ha?")
	}

	return (
		<aside className="border-t-white border-t sm:border-none fixed bottom-0 left-0 sm:h-full sm:w-24 w-full flex sm:flex-col flex-row justify-around sm:bg-transparent bg-black items-center py-2 transition-all">
			<Link to="/profile">
				<img src={(UserImg) ? UserImg : "/img/defUser.jpg"} className="w-10 rounded-full"/>
			</Link>
			
			
			<Link to="/Accounts">
				<Fa icon={ faUsers } className="hover:text-blue-500 transition-all text-white" size="xl"/>
			</Link>
			
			<Link to="/">
				<Fa icon={ faHouse } className="hover:text-blue-500 transition-all text-white" size="xl"/>
			</Link>
			

			<Link to="/">
				<Fa icon={ faCog } className="hover:text-blue-500 transition-all text-white" size="xl"/>
			</Link>
			
			
			<Fa onClick={signOut} icon={ faSignOut } className="cursor-pointer hover:text-blue-500 transition-all text-white" size="xl"/>
		</aside>
	)
};

export default NavBar;