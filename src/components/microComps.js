import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { faInfoCircle, faWarning, faCircleCheck, faEdit } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';
import { convertBase64 } from "../server/functions";
import { useSelector, useDispatch } from 'react-redux';
import { 
  updateUser
} from '../store/userStore';

const Paragraphs = ({ Text, Class="" }) => {
	
	const Lines = Text.split('\n');

	return (
		(Lines.length > 1) ? (
			Lines.map((v, idx) => (v.length > 1) ? <p key={idx} className={Class}> {v} </p> : "")
		) : (
			<p className={Class}> { Lines[0] } </p>
		)
	)

}


const ApplicationNotification = ({ msg, StyleKey, id }) => {

	const [show, setShow] = useState(false);

	const Map_ = {
		info: {
			T: "text-slate-900 bg-white",
			icon: faInfoCircle
		},
		
		error: {
			T: "text-white bg-rose-500",
			icon: faWarning
		},

		success: {
			T: "text-white bg-green-500",
			icon: faCircleCheck
		}
	}

	if(!(StyleKey in Map_)) StyleKey = "error"
	// For developement.
	
	useEffect(() => {
		
		setShow(true); 
		
		const TimeOut = setTimeout(() => setShow(false), 5 * 1000);

		return () => {
			setShow(false)
			clearTimeout(TimeOut);
		};

	}, [id])

	return (
			((StyleKey in Map_) && msg) ? (
			
				<div className={`${show ? "translate-y-2 opacity-100" : "-translate-y-16 opacity-0"} z-50 flex flex-row items-center justify-center shadow visible fixed top-1 p-3 rounded transition-all -translate-x-1/2 left-1/2 ${Map_[StyleKey].T}`}> 
					<span className="mx-2"> { msg } </span>
					<Fa icon={Map_[StyleKey].icon} />
				</div>

			) : ""
	)
}

const Iframe = ({ Obj, NotificationFunc = () => {} }) => {
	
	const MainContainer = useRef(null);
	const Dispatch = useDispatch();
	const [Notification, setNotification] = useState(null);
	const [imgData, setimgData] = useState(Obj.variables.img);
	const [buffer, setBuffer] = useState(null);
	const [Vars, setVars] = useState({
		uuid: Obj.variables.uuid,
		payload: Obj.variables.payload,
		key: Obj.variables.Updatekey
	});

	const uploadBuffer = () => {
		Vars.payload(buffer, Vars.uuid)
		.then(res => {
			return res.json();
		})
		.then(js => {
			
			console.log(js)
			
			if(js.code === 200) {
				var UpdatingObject = {  };
				UpdatingObject[Vars.key] = buffer;
				Dispatch(updateUser(UpdatingObject))
				setimgData(buffer)
			} else {
				console.log(js);
			}

		})

		.catch(e => {
			console.log(e);
		})
	}

	useEffect(() => {
		
		if(buffer) {
			uploadBuffer()	
		}

	}, [buffer])

	const OnEdit = (e) => {
		document.getElementById("imgFile").click();
	};

	const OnFileUpload = (e) => {
		console.log("Clicked")
		
		convertBase64(e.target.files[0])
		.then(Data => {
			// TODO Edit background and profile image feature.
			setBuffer(Data);
			
		})
		
		.catch(e => {
			setNotification({ 
				text: "profile image could not be uploaded!" + String(e),
				status: "error"
			});
		})
	}

	return (
		<div
			style={{
				background: "rgba(0 0 0 / 40%)"
			}}
			ref={MainContainer}
			className="fixed top-0 flex flex-col justify-center items-center left-0 w-screen h-screen bg-black" 
			
			onClick={(e) => {
				var flag = false;
				
				if(!(e.target === MainContainer.current)) {
					flag = true;
				};

				Obj.onclick(flag);
			}}
		>
			{(Notification) ? <Notify msg={Notification.text} StyleKey={Notification.status}/> : ""}
			
			<input type="file" id="imgFile" accept="image/*" className="hidden" onChange={OnFileUpload} />

			<img 
				src={imgData} 
				alt="img" 
				className="sm:w-[400px] w-[70%] rounded"
			/>

			{
				(Obj.variables.Editable) ? (
					<button onClick={OnEdit} className="my-3 bg-blue-700 hover:bg-blue-500 transition-all p-2 text-white rounded">
						Edit <Fa icon={faEdit}/>
					</button>	
				) : ""
			}
		</div>
	)
}

const Retry = ({ func }) => {
	return (
		<>
			<h1 className="my-2"> Failed to load data! </h1>
			<button
				className="hover:text-slate-700 hover:bg-white p-2 bg-neutral-900 rounded-md"
				onClick={func}
			>
				try again
			</button>
		</>
	)
}


export {
	Paragraphs, 
	ApplicationNotification,
	Iframe,
	Retry
};