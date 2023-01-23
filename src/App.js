import "./index.css";
import "./global_fallback.css";

import Home from "./routes/Home";
import Login from "./routes/Login";
import SignUp from "./routes/SignUp";
import ChatUI, { ConversationUI } from "./routes/ChatUI";
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
import { HOST, NOTIFICATION, NEWPOST, MSG } from "./server/Var";
import { useSocket } from "./server/socketOps"


const App = () => {    
    
    const User = useSelector(state => state.User);
    const PostPool = useSelector(state => state.PostPool);
    const [NewPosts, setNewPosts] = useState([]);
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(true);
    const [Notification, setNotification] = useState(null);
    const [NewNots, setNewNots] = useState([])
    const [FetchedNotifications, setFetchedNotifications] = useState([]);
    const [FuncPool, setFuncPool] = useState({});
    const [NewMsgs, setNewMsgs] = useState([]);
    // Counters 
    const [notCount, setnotCount] = useState(0);
    const [NewMessageCount, setNewMessageCount] = useState(0);
   
    const AddToPool = (Obj) => {
        setFuncPool(p => {
            return { ...p, ...Obj };
        })
    }

    const HandleNewNotification = (ob) => {
        setNewNots([...NewNots, ob]);
        setnotCount(p => p + 1);
    }

    const HandleNewPost = (ob) => {
        setNewPosts(
            p => [ob, ...p]
        );
    }

    const HandlePostChange = (ob) => console.log(ob)

    const LogUnknownActionData = (data) => {
        console.log("-------------------------------------------------------------------")
        console.log("Unsupported action: ")
        console.log(        data       )
        console.log("-------------------------------------------------------------------")
    }

    const HandleShatNewMsg = (msgObject) => {
        
        msgObject.side = "left";
    
        setNewMsgs(
            p => [...p, msgObject]
        );

        setNewMessageCount(p => p + 1);
    };

    const onMessageCallback = (m) => {
        
        var SockMsg = JSON.parse(m.data)
        
        switch (SockMsg.action) {
            case NOTIFICATION:
                HandleNewNotification(SockMsg.data);
                break

            case NEWPOST:
                HandleNewPost(SockMsg.data);
                break
           
            // case POSTCHANGE:
            //     HandlePostChange(SockMsg.data);    
            //     break

            case MSG:
                HandleShatNewMsg(SockMsg.data)
                break

            default:
                LogUnknownActionData(SockMsg)
                break
        }

    }
    
    var [SocketConn, setSocketConn] = useState(null);
    var NotsFetched = false;

    const fetchOldNotifications = () => {
        
        var Data = [];
        
        GetUserNotifications(User.id_)
        .then(r => r.json())
        .then(Json => {
            if(Json.code === 200) {

                if(Json.data !== null) {
                    Data = Json.data;
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
                    dispatch(login(user));
        
                } else {
                    console.log(Json);
                }
            })
            .finally(() => {
                setLoading(false);
            })
            .catch(e => {
                
                dispatchNotificationEvent({
                    text: "Could not login.",
                    status: "error"
                })

            })
        } else {
            setLoading(false);
        }

        return () => setLoading(true);

    }, []);

    

    useEffect(() => {
        
        if(User) {
            if(SocketConn === null) {
                var s = useSocket(User.id_, onMessageCallback);
                setSocketConn(s);    
            }

            fetchOldNotifications();
        }

        return () => {
            setSocketConn(null);
            setFetchedNotifications([]);
            setNewNots([]);
            setnotCount(0);
        }
                
    }, [User])

    const [ID, setID] = useState(0);

    const dispatchNotificationEvent = (ob) => {
        
        setNotification({
            ...ob,
            id: ID
        });

        setID(o => o + 1)
    }

    return (
        <>
            {
                (User && !Loading) ? (
                        <>
                            <NavBar NewMsgCount={NewMessageCount} UserImg={User.img} NewNotificationCount={notCount}/>
                            { ("setPosts" in FuncPool) ? <FloatingPostFormUI setPosts={FuncPool["setPosts"]} NotificationFunc={dispatchNotificationEvent} /> : "" }
                            <Routes>
                                <Route path="/" element={<Home NewPosts={NewPosts} setNewPosts={setNewPosts} NotificationFunc={dispatchNotificationEvent} funcPoolManager={AddToPool} />} />
                                <Route path="/chat" element={<ChatUI flushMessages={() => setNewMsgs([])} User={User} NewMessages={NewMsgs} NotificationFunc={dispatchNotificationEvent} Conn={SocketConn} />} />
                                <Route path="/Home" element={<Home NewPosts={NewPosts} setNewPosts={setNewPosts} NotificationFunc={dispatchNotificationEvent} funcPoolManager={AddToPool} />} />
                                <Route path="/Login" element={<Login NotificationFunc={dispatchNotificationEvent} />} />
                                <Route path="/Signup" element={<SignUp NotificationFunc={dispatchNotificationEvent}/>} />
                                <Route path="/profile" element={<CurrentUserProfile NotificationFunc={dispatchNotificationEvent}/>}/>
                                <Route path="/Notifications" element={<UserNotifications socketConn={SocketConn} Notifications={FetchedNotifications} CountCallback={setnotCount} NewNotifications={NewNots}/>} />
                                <Route path="/i" element={<Icons NotificationFunc={dispatchNotificationEvent} />} />
                                <Route path="/Accounts" element={<AccountsSearchPannel CurrUserId={User.id_} NotificationFunc={dispatchNotificationEvent} />}/>
                                <Route 
                                    path="/chat/:conversation_id" 
                                    action={({ params }) => {}}
                                    loader={({ params }) => {}}
                                    element={<ConversationUI CurrUserId={User.id_} Conn={SocketConn} NotificationFunc={dispatchNotificationEvent}/>} 
                                />

                                <Route
                                    path="/Accounts/:id"
                                    loader={({ params }) => {
                                        alert(params.id);
                                    }}
                                  
                                    action={({ params }) => {}}
        
                                    element={<Account NotificationFunc={dispatchNotificationEvent} />}
                                />
                                
                                <Route
                                    path="/Post/:id"
                                    loader={({ params }) => {
                                        alert(params.id);
                                    }}
                                  
                                    action={({ params }) => {}}
        
                                    element={<PostPage NotificationFunc={dispatchNotificationEvent} />}
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
                                <Route path="/" element={<Login NotificationFunc={dispatchNotificationEvent} />} />
                                <Route path="/Signup" element={<SignUp NotificationFunc={dispatchNotificationEvent} />} />
                                <Route path="/Login" element={<Login NotificationFunc={dispatchNotificationEvent} />} />
                            </Routes>
                        )
                    )}
            <div>
                { (Notification) ? <ApplicationNotification msg={Notification.text} StyleKey={Notification.status} id={ID}/> : ("") }
            </div>
        </>
    );
}

export default  App;