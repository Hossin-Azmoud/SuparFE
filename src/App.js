import "./index.css";
import Home from "./routes/Home";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";

import { Routes, Route, useParams } from "react-router-dom";
import Icons from "./routes/Icons";
import CurrentUserProfile, { Account } from "./routes/Profile";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from 'react-redux';
import { SetAuthCookie, JWT } from "./server/functions";
import { 
    login
} from './store/userStore';
import NavBar from "./components/UserInterfaceComponents/NavBar";
import Loader from "./components/UserInterfaceComponents/Loader";
import AccountsSearchPannel from "./routes/Search";
import UserNotifications from "./routes/UserNotifications";
import { SubmitJWT } from "./server/serverFuncs";
import { Notify } from "./components/UserInterfaceComponents/microComps";
import { HOST } from "./server/Var";

const App = () => {    
    const User = useSelector(state => state.User);
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(true);
    const [Notification, setNotification] = useState(null);

    useEffect(() => {

        if(JWT) {
            SubmitJWT(JWT)
            .then((res) => {
                return res.json()
            })
            .then((Json) => {
                
                if(Json.code === 200) {
                    var user = Json.data;

                    if(HOST) {
                        user.img = user.img.replace("localhost", HOST)
                        user.bg = user.bg.replace("localhost", HOST)
                    }
                   
                    dispatch(login(user));
        
                } else {
                    console.log(Json);
                }
            })
            .finally(() => {
                setLoading(false); 
            })
            .catch(e => {
                setNotification({
                    text: "Could not login.",
                    status: "error"
                })
            })
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
                                    <Route path="/Notifications" element={<UserNotifications />} />
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