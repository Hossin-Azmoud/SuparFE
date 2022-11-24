import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState } from 'react';
import { faHouse, faUserFriends, faSignOut, faUsers, faCog  } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { Link } from "react-router-dom";

const NavBar = ({ UserImg }) => {
	return (
		<aside className="border-t-white border-t sm:border-none fixed bottom-0 left-0 sm:h-full sm:w-24 w-full flex sm:flex-col flex-row justify-around sm:bg-transparent bg-black items-center py-2 transition-all">
			<Link to="/profile">
				<img src={UserImg} className="w-10 rounded-full"/>
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
			
			<Link to="/">
				<Fa icon={ faSignOut } className="hover:text-blue-500 transition-all text-white" size="xl"/>
			</Link>

		</aside>
	)
};

export default NavBar;