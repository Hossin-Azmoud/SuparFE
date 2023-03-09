import * as OB from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome'
import { useEffect, useState } from "react"


const Icons = ({ NotificationFunc }) => {

	const [icons, setIcons] = useState();
	const [Loading, setLoading] = useState(true);
	const [Icon, setIcon] = useState(null);
	
	const openFrame = (i) => setIcon(i)
	const closeFrame = () => setIcon(null)

	useEffect(() => {
		setIcons(OB);
		setLoading(false);
	}, []);

	const copy = (T) => {
    	document.execCommand('copy', true, T);
		NotificationFunc({
            text: `copied ${T}`,
            status: "success"
		})
	}

	const OnTyping = (e) => {
		setLoading(true);
		if(e.target.value) {
		
			let q = e.target.value.trim().toUpperCase();
			let temp = {};
			let keys = Object.keys(OB);
			let len = keys.length
			let i = 0;
			
			for (i; i < len ; i++) {
				if(keys[i].toUpperCase().includes(q)) temp[keys[i]] = OB[keys[i]]
			}
			
			setIcons(temp);
			setLoading(false);
			return;	
		} 
		
		setIcons(OB);
		setLoading(false);
	}

	return (
		<div className="absolute top-0 left-0 z-30 bg-black">
			{ 
				(Icon) ? (
					<>
						<div className="fixed w-screen h-screen left-0 top-0 bg-black opacity-50" onClick={closeFrame}>
						</div>

						<div className="w-[90%] sm:w-[400px] border border-neutral-900 fixed bg-black -translate-y-1/2 -translate-x-1/2 left-1/2 top-1/2 rounded p-2">
							<div className="flex items-start justify-between">
								<Fa icon={Icon} size="5x" className="text-white p-4 bg-slate-900 rounded"/>
								
								<p className="text-white p-4">
									{ Icon.iconName }
								</p>
							</div>
						</div>
					</>
				) : "" 
			}
			<div className="w-[300px] mx-auto my-2 p-1">
	            <input onChange={OnTyping} type="text" className="bg-neutral-900 outline-none border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-neutral-800 focus:border-neutral-800 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-yellow-500 dark:focus:border-yellow-500" placeholder="Look for an icon!" required> 
	            </input>
			</div>

			<h1 className="text-white text-3xl text-center"> Look for icons! </h1>
			
			{
				(!Loading) ? (
					<>
						<section className="text-white w-full h-full flex flex-wrap flex-row justify-center items-center p-4 ">
							{
								Object.keys(icons).map((k) => {
									return (k !== "fas" && k !== "prefix") ? (
											<button onClick={ () => openFrame(icons[k]) } className="w-20 cursor-pointer bg-neutral-900 flex flex-row p-4 overflow-dots justify-center items-center m-2 rounded-md transition-all hover:shadow-sm hover:shadow-white" title={k} key={k}>
												<Fa 
													icon={icons[k]} 
													size="lg" 
													className="mx-1 text-white" 
												/>
				              				</button>
										) : ""
								})
							}
						</section>
					</>
			) : <h1 className="font-thin text-white text-xl p-6"> Loading... </h1>
			}
		</div>
	)
}



export default Icons;