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
import NavBar from "./components/NavBar";
import { AppMainLoader as Loader } from "./components/Loader";
import { FloatingPostFormUI } from "./components/Post";
import AccountsSearchPannel from "./routes/Search";
import UserNotifications from "./routes/UserNotifications";
import { SubmitJWT, GetUserNotifications } from "./server/serverFuncs";
import { ApplicationNotification } from "./components/microComps";
import { PostPage } from "./components/Post";
import { HOST, NOTIFICATION } from "./server/Var";
import { useSocket } from "./server/socketOps"

const App = () => {    
    const User = useSelector(state => state.User);
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(true);
    const [Notification, setNotification] = useState(null);
    const [NewNots, setNewNots] = useState([])
    const [notCount, setnotCount] = useState(0);
    const [FetchedNotifications, setFetchedNotifications] = useState([]);
    const [FuncPool, setFuncPool] = useState({});
    
    const AddToPool = (Obj) => {
        setFuncPool(p => {
            return { ...p, ...Obj };
        })
    }

    const HandleNewNotification = (ob) => {
        if(HOST) {                    
            ob.User.img = ob.User.img.replace("localhost", HOST);
            ob.User.bg = ob.User.bg.replace("localhost", HOST);
        }

        // alert("New Notification");
        setNewNots([...NewNots, ob]);
        setnotCount(p => p + 1);
    }

    const onMessageCallback = (m) => {
        var SockMsg = JSON.parse(m.data)
        console.log(SockMsg);
        
        if(SockMsg.action === NOTIFICATION) {
            HandleNewNotification(SockMsg.data)
        }
    }
    
    var [NotificationSocket, setNotificationSocket] = useState(null);

    const fetchOldNotifications = () => {
        var Data = [];
        
        GetUserNotifications(User.id_)
        .then(r => r.json())
        .then(Json => {
            if(Json.code === 200) {

                if(Json.data !== null) {
                    Data = Json.data;
                    
                    Data.map(u => {
                        if(HOST) {                    
                            u.User.img = u.User.img.replace("localhost", HOST);
                            u.User.bg = u.User.bg.replace("localhost", HOST);
                        }
                    });

                }
            }
        })
        .finally(() => {
            var tmp = [];

            for(let i = 0; i < Data.length; i++) {
                const NotificationObj = Data[i];
                if(!Boolean(NotificationObj.seen)) {
                    tmp.push(NotificationObj);
                    console.log(NotificationObj);
                    Data = Data.filter(j => j.id !== NotificationObj.id);
                }
            }

            setFetchedNotifications(Data);
            setnotCount(p => tmp.length + p);
            setNewNots([...NewNots, ...tmp]);
        })
        .catch(e => console.log(e))
    }


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

        return () => setLoading(false);

    }, []);

    useEffect(() => {
        
        if(User) {
            if(NotificationSocket === null) {
                var s = useSocket(User.id_, onMessageCallback);
                setNotificationSocket(s);    
            }
            
            fetchOldNotifications();
        }

        return () => {
            setNotificationSocket(null);
            setFetchedNotifications([]);
        }
                
    }, [User])

    return (
        <>
            {
                (User && !Loading) ? (
                        <>
                            <NavBar UserImg={User.img} NewNotificationCount={notCount}/>
                            { ("setPosts" in FuncPool) ? <FloatingPostFormUI setPosts={FuncPool["setPosts"]} NotificationFunc={setNotification} /> : "" }
                            

                            <Routes>
                                
                                <Route path="/" element={<Home NotificationFunc={setNotification}/>} />
                                <Route path="/Home" element={<Home NotificationFunc={setNotification} funcPoolManager={AddToPool} />} />
                                <Route path="/Login" element={<Login NotificationFunc={setNotification} />} />
                                <Route path="/Signup" element={<SignUp NotificationFunc={setNotification}/>} />
                                <Route path="/profile" element={<CurrentUserProfile NotificationFunc={setNotification}/>}/>
                                <Route path="/Notifications" element={<UserNotifications socketConn={NotificationSocket} Notifications={FetchedNotifications} CountCallback={setnotCount} NewNotifications={NewNots}/>} />
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
                                <Route
                                    path="/Post/:id"
                                    loader={({ params }) => {
                                        alert(params.id);
                                    }}
                                  
                                    action={({ params }) => {}}
        
                                    element={<PostPage NotificationFunc={setNotification} />}
                                />
                                


                           </Routes>
                       </>
                    ) : (
                        (Loading) ? (
        
                            <div className="w-screen h-screen flex justify-center items-center absolute top-0 left-0">
                                <Loader size="30" color="blue-500" />
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
                { (Notification) ? <ApplicationNotification msg={Notification.text} StyleKey={Notification.status}/> : ("") }
            </div>
        </>
    );
}

export default  App;