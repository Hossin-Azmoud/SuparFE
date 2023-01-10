import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addFollow, removeFollow, GetUserById } from "../server/serverFuncs"

const UserUI = ({
	CurrUserId_,
	id_,
	img = "",
	UserName = "",
	Followed = false
}) => {
	
	const [PassedUser, setPassedUser] = useState({
		id_,
		img,
		UserName,
		Followed
	})

	const [
		followed, setfollowed
	] = useState(PassedUser.Followed)


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

    useEffect(() => {
    	// TODO: get Users if not only the id_ was specified..
    	if(!PassedUser.UserName) {
    		GetUserById(PassedUser.id_, CurrUserId_)
    		.then(r => r.json())
    		.then(j => {
    			if(j.code === 200) {
    				console.log(j.data);
    				// setPassedUser(r.data)
    			}

    		})
    		.catch(e => console.log(e))
    	}
    	
    	return () => { console.log("unmounted.") }
    }, [])

	return (
	
		(PassedUser.UserName) ? (
				
				<div className="flex bg-neutral-900 flex-row w-[90%] justify-between items-center bg-black rounded p-2 my-1 text-slate-900 font-semibold sm:w-[400px]"> 
		
					<Link to={`/Accounts/${PassedUser.id_}`}>
						<img className="shadow-xl w-10 rounded-full h-10" src={(PassedUser.img) ? PassedUser.img : "/img/defUser.jpg"} />
					</Link>
					<div className="w-[50%] flex flex-col justify-start items-start">
						<p className="text-white"> {UserName} </p>
						<p className="text-sm text-neutral-700"> #{PassedUser.id_} </p>
					</div>
					<button className={`px-6 py-1 shadow-md rounded duration-50 ${ (!followed) ? " hover:bg-sky-400 bg-sky-500" : "bg-slate-900 border border-white" }`} onClick={follow}>
						<span className="font-thin text-sm text-white"> 
							
							{
								(followed) ? "unfollow" : "follow"
							}

						</span>
					</button>
				</div>

		) : ("")
	)	
}

const UserDisplay= ({Userid_, UserName, UserImg}) => {
	return (
		<div className="flex flex-row items-start justify-start">
			<Link to={`/Accounts/${Userid_}`}>
				<img src={UserImg ? UserImg : "/img/defUser.jpg"} alt="user avatar" className="rounded-full w-10 h-10" />
			</Link>
			<span className="ml-2">
				<h5 className="font-semibold text-base text-sky-100"> { UserName } </h5>
				<h5 className="font-thin text-sm text-green-700 "> #{ Userid_ } </h5>
			</span>	
		</div>
	)
}

export default UserUI;
export {
	UserDisplay
};