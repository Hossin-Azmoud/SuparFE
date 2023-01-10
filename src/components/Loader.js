import "./Css/Loader.css";
import Logo from "./Logo"

const Loader = ({
	color="white",
	size=20,
	Class=""
}) => (<div id="circle2" style={{
	width: `${size}px`,
	height: `${size}px`
}} className={`show border-t-${color} ${Class}`}></div>);

const AppMainLoader = () => <Logo class_="w-24" />


export default Loader;

export {
	AppMainLoader
};