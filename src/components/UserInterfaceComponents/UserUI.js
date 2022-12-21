import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addFollow, removeFollow } from "../../server/serverFuncs"
const UserUI = ({
	CurrUserId_,
	id_,
	img,
	UserName,
	Followed = false
}) => {

	const [
		followed, setfollowed
	] = useState(Followed)

	const follow = () => {
    	// TODO Wanna add an api call.
		

		if(followed) {
			setfollowed(false);
			removeFollow(CurrUserId_, id_)
			.then(r => r.json())
			.then(d => {
				if(d.code === 200) {
					console.log(d.data)
				} else {
					setfollowed(p => !p)
				}
			})
			.catch(e => {
				console.log("error: ", e);
			})
		} else {
			setfollowed(true);
			addFollow(CurrUserId_, id_)
			.then(r => r.json())
			.then(d => {
				if(d.code === 200) {
					console.log(d.data)
				} else {
					setfollowed(p => !p)
				}
			})
			.catch(e => {
				console.log("error: ", e);
			})
		}
		
    	
    	return () => {
    		setfollowed(false)
    	};
    }

	return (
		<div className="flex bg-neutral-900 flex-row w-[90%] justify-between items-center bg-black rounded p-2 my-1 text-slate-900 font-semibold sm:w-[400px]"> 
			
			<Link to={`/Accounts/${id_}`}>
				<img className="shadow-xl w-10 rounded-full h-10" src={(img) ? img : "/img/defUser.jpg"} />
			</Link>
			<div className="w-[50%] flex flex-col justify-start items-start">
				<p className="text-white"> {UserName} </p>
				<p className="text-sm text-neutral-700"> #{id_} </p>
			</div>
			<button className={`px-6 py-1 shadow-md rounded duration-50 ${ (!followed) ? " hover:bg-sky-400 bg-sky-500" : "bg-slate-900 border border-white" }`} onClick={follow}>
				<span className="font-thin text-sm text-white"> 
					{
						(followed) ? "unfollow" : "follow"
					}
				</span>
			</button>
		</div>
	)	
}

export default UserUI;