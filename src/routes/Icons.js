import * as OB from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon as Fa} from '@fortawesome/react-fontawesome'
import { useEffect, useState } from "react"


const Icons = () => {

	const [icons, setIcons] = useState();
	const [Loading, setLoading] = useState(true);

	useEffect(() => {
		setIcons(OB);
		setLoading(false);
	}, []);

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
			
		} else {

			setIcons(OB);
		}

		setLoading(false);
	}

	return (
		<div className="absolute top-0 left-0 z-50 bg-black">
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
									return (
					              		<span onClick={ () => alert(k) } className="w-20 cursor-pointer bg-neutral-900 flex flex-row p-4 overflow-dots justify-center items-center m-2 rounded-md transition-all hover:shadow-sm hover:shadow-white" title={k} key={k}>
											<Fa icon={icons[k]} size="lg" className="mx-1 text-white" />
					              		</span>
									)
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




