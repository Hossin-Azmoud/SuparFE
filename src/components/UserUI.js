import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { addFollow, removeFollow, GetUserById } from "../server/serverFuncs"

const UserUI = ({
	CurrUserId_,
	id_,
	img = "",
	UserName = "",
	Followed = false,
	class_=""
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
				
				<div className={`flex bg-neutral-900 border border-neutral-700 border flex-row w-full justify-between items-center bg-black rounded my-1 text-slate-900 sm:w-[400px] ${class_} px-2 py-1`}> 
			
					<div className="flex flex-row items-center justify-center">
						<Link to={`/Accounts/${PassedUser.id_}`}>
							<img className="shadow-xl w-10 rounded h-10" src={(PassedUser.img) ? PassedUser.img : "/img/defUser.jpg"} />
						</Link>
						
						<div className="flex mx-6 flex-col justify-start items-start">
							<p className="text-white"> {UserName} </p>
							<p className="text-sm  text-thin text-orange-300"> #{PassedUser.id_} </p>
						</div>
					</div>


					<button className={`px-4 py-1 shadow-md rounded duration-50 ${ (!followed) ? " hover:bg-sky-400 bg-sky-500" : "bg-slate-800" }`} onClick={follow}>
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

const UserDisplay= ({ Userid_, UserName, UserImg }) => {
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