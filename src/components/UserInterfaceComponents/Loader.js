import "../Css/Loader.css";

const Loader = ({
	color="white",
	size=20,
	Class=""
}) => (<div id="circle2" style={{
	width: `${size}px`,
	height: `${size}px`
}} className={`show border-t-${color} ${Class}`}></div>);

export default Loader;