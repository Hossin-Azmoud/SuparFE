import "./index.css";
import Home from "./components/Javascript/Routes/Home";
import Login from "./components/Javascript/Routes/Login";
import SignUp from "./components/Javascript/Routes/SignUp";
import { Routes, Route, useParams } from "react-router-dom";
import Icons from "./components/Javascript/Routes/Icons";
import CurrentUserProfile, { Account } from "./components/Javascript/Routes/Profile";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { SetAuthCookie, JWT } from "./components/Javascript/Util/functions";
import { 
    login
} from './components/Javascript/store/userStore';
import NavBar from "./components/Javascript/UserInterface/NavBar";
import Loader from "./components/Javascript/UserInterface/Loader";
import AccountsSearchPannel from "./components/Javascript/UserInterface/SearchPannel";
import { SubmitJWT } from "./components/Javascript/Util/serverFuncs";
import { Notify } from "./components/Javascript/UserInterface/microComps";

const App = () => {
    
    const User = useSelector(state => state.User);
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(true);
    const [Notification, setNotification] = useState(null);

    useEffect(() => {

        if(JWT) {
            console.log(JWT);
            SubmitJWT(JWT)
            .then((res) => {
                return res.json()
            })
            .then((Json) => {
                console.log(Json.data);
                if(Json.code === 200) {
                    dispatch(login(Json.data));
                    console.log(Json.data);
                } else {
                    console.log(Json);
                }
                
                console.log(Json)

            })
            .finally(() => {
                setLoading(false); 
            });
        } else {
            setLoading(false);
        }

    }, []);

    return (
        <>
            {
                (User && !Loading) ? (
                            <>
                           
                                <NavBar UserImg={User.img}/>
                                <Routes>
                                    
                                    <Route path="/" element={<Home NotificationFunc={setNotification}/>} />
                                    <Route path="/Home" element={<Home NotificationFunc={setNotification}/>} />
                                    <Route path="/Login" element={<Login NotificationFunc={setNotification} />} />
                                    <Route path="/Signup" element={<SignUp NotificationFunc={setNotification}/>} />
                                    <Route path="/profile" element={<CurrentUserProfile NotificationFunc={setNotification}/>}/>
                                    <Route path="/i" element={<Icons />} />
                                    <Route path="/Accounts" element={<AccountsSearchPannel CurrUserId={User.id_} NotificationFunc={setNotification} />}/>
                       
                                    <Route
                                        path="/Accounts/:id"
                                        loader={({ params }) => {
                                            alert(params.id);
                                        }}
                                      
                                        action={({ params }) => {}}
            
                                        element={<Account NotificationFunc={setNotification} />}
                                    />
            
                               </Routes>
                           </>
                        ) : (
                            (Loading) ? (
            
                                <div className="w-screen h-screen flex justify-center items-center absolute top-0 left-0">
                                    <Loader size="40" color="blue-500" />
                                </div>
            
                            ) : (
                                <Routes>
                                    <Route path="/i" element={<Icons />} />
                                    <Route path="/" element={<Login NotificationFunc={setNotification} />} />
                                    <Route path="/Signup" element={<SignUp NotificationFunc={setNotification} />} />
                                    <Route path="/Login" element={<Login NotificationFunc={setNotification} />} />
                                </Routes>
                            )
                        )}
            <div>
                { (Notification) ? <Notify msg={Notification.text} StyleKey={Notification.status}/> : ("") }
            </div>
        </>
    );
}

export default  App;