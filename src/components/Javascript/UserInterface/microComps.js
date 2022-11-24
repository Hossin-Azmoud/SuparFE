import { useState, useEffect, useRef } from "react";
import { faInfoCircle, faWarning, faCircleCheck } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa } from '@fortawesome/react-fontawesome';


const Paragraphs = ({ Text, Class="" }) => {
	
	const Lines = Text.split('\n');

	return (
		(Lines.length > 1) ? (
			Lines.map((v, idx) => (v.length > 1) ? <p key={idx} className={Class}> {v} </p> : "")
		) : (
			<p class={Class}> { Lines[0] } </p>
		)
	)

}

const IMFrame = ({ img, show_=true }) => {
	const [show, setShow] = useState(show_);
	const hide = () => setShow(false);
	useEffect(() => setShow(true), []);

	return (
		(show) ? (
			<div style={{
			background: "rgba(0 0 0 / 40%)"
			}} className="fixed top-0 flex justify-center items-center left-0 w-screen h-screen bg-black" onClick={hide}>
				<img src={img} alt="img" className="w-64 rounded"/>
			</div>
		) : ""
	)
};

const Notify = ({ msg, StyleKey }) => {


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

	const frame = useRef(null);
	
	const initialize = () => {
		frame.current.style.display = "block";
		frame.current.style.transform = "translateY(0)";
		frame.current.style.opacity = "1";
	}

	const hide = () => {
		frame.current.style.transform = "translateY(-20px)";
		frame.current.style.opacity = "0";

		setTimeout(() => {
			frame.current.style.display = "none";
		}, 2000);

	}
	
	// For developement.
	useEffect(() => {
		initialize();
	}, [StyleKey, msg])

	useEffect(() => {
		initialize();
		setTimeout(hide, 10 * 1000);
	}, [])

	return (
		<div ref={frame} className={`flex flex-row items-center justify-center shadow visible SlideFromTop fixed top-5 w-[200px] p-4 rounded ${Map_[StyleKey].T}`}> 
			 
			<span className="mx-2"> { msg } </span>
			<Fa icon={Map_[StyleKey].icon} />
		</div>
	)
}

export { 
	Paragraphs, 
	Notify,
	IMFrame
};