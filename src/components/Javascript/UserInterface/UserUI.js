import { useEffect } from "react";
import { Link } from "react-router-dom";
const UserUI = ({
	id_,
	img,
	UserName
}) => {

	return (
		<div className="flex bg-neutral-900 flex-row w-full justify-between items-center bg-black rounded p-4 m-1 text-slate-900 font-semibold sm:w-[400px]"> 
			<Link to={`/Accounts/${id_}`}>
				<img className="shadow-xl w-10 rounded-full h-10" src={(img) ? img : "/img/defUser.jpg"} />
			</Link>
			<div className="w-[50%] flex flex-col justify-start items-start">
				<p className="text-white"> {UserName} </p>
				<p className="text-sm text-neutral-700"> #{id_} </p>
			</div>
			<button className="shadow-md rounded text-white text-sm hover:bg-sky-400 duration-50 bg-sky-500 p-2">
				follow
			</button>
		</div>
	)	
}

export default UserUI;