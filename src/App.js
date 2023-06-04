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
import { SubmitJWT, GetUserNotifications, LoadJWT } from "./server/serverFuncs";
import { ApplicationNotification } from "./components/microComps";
import { PostPage } from "./components/Post";
import { HOST, NOTIFICATION, NEWPOST, MSG, LIKE, COMMENT } from "./server/Var";
import { useSocket } from "./server/socketOps";

const useFree = (init) => {
    /* My freeing hook! */
    const [state, setState] = useState(init);
    return [
        state, 
        setState,
        (() => setState(init))
    ];
}


// const useOnce = (init) => {
//     const [state, setState] = useState(init);
//     const use = setState()
    
//     return [
//         state, 
//         setState,
//         (() => setState(init))
//     ];
// }

const App = () => {
    var User = useSelector(state => state.User);
    
    const dispatch = useDispatch();
    
    // Loading state.
    const [Loading, setLoading] = useState(true);
    
    // Application main notifier state.
    const [Notification, setNotification] = useState(null);
    
    const [FetchedNotifications, setFetchedNotifications] = useState([]);
    
    const [FuncPool, setFuncPool] = useState({});
    const freefuncPool = () => setFuncPool({});
    // Socket handeled states.
    const [NewMsgs, setNewMsgs] = useState([]);
    const [NewPosts, setNewPosts] = useState([]);
    const flushNewPosts = () => setNewPosts([])

    const [NewComments, setNewComments] = useState([]);
    const flushNewComments = () => setNewComments([])

    const [NewLikes, setNewLikes] = useState([]);
    const flushNewLikes = () => setNewLikes([])

    // NotificationPool, FreeNotificationPool
    const [notificationPool, setNotificationPool] = useState([])
    const freeNotificationPool = () => setNotificationPool([])

    // Counters 
    const [notCount, setnotCount] = useState(0);
    const [NewMessageCount, setNewMessageCount] = useState(0);
    const [NotificationID, setID] = useState(0);

    let NotsFetched = false;
    // Socket
    var [SocketConn, setSocketConn] = useState(null);
    
    /*       Functions         */
    const AddToPool = (Obj) => {
        setFuncPool(p => {
            return { ...p, ...Obj };
        })
    }
    
    const HandleNewNotification = (ob) => {
        if(notificationPool.length == 0) {
            setNotificationPool([ob])   
        }

        if(notificationPool.length > 0) {
            setNotificationPool([ob, ...notificationPool])
        }

        setnotCount(p => p + 1);
    }
    
    const HandleNewPost = (ob) => {
        
        ob.post_comments = [];
        ob.post_likes = [];
        ob.comments_count = 0;
        ob.likes_count = 0;
        setNewPosts(p => [ob, ...p]);

    }

    const HandlePostChange = (ob) => console.log(ob)
    
    const LogUnknownActionData = (data) => {
        console.log("-------------------------------------------------------------------")
        console.log("Unsupported action: ")
        console.log(        data       )
        console.log("-------------------------------------------------------------------")
    }

    const HandleShatNewMsg = (msgObject) => {
        msgObject.side = "right"; 
        
        setNewMsgs(
            p => [...p, msgObject]
        );

        setNewMessageCount(p => p + 1);
    }

    const HandleNewComment = (Comment) => {
        console.log("NEW Comment")
        console.table(Comment);
        // Mutate state.
        setNewComments(
            p => [Comment, ...p]
        );
    }
  
    const HandleNewLike = (Like) => {
        console.log("NEW Like")
        console.table(Like);
        // Mutate state.
        setNewLikes(
            p => [Like, ...p]
        );
    }

    const onMessageCallback = (m) => {
        
        var SockMsg = JSON.parse(m.data)
        
        switch (SockMsg.action) {
            
            case NOTIFICATION:
                HandleNewNotification(SockMsg.data);
                break

            case NEWPOST:
                HandleNewPost(SockMsg.data);
                break
            
            case COMMENT:
                // TODO add the comment to the posts.
                HandleNewComment(SockMsg.data);
                break

            case LIKE:
                // TODO Add the like to the posts.
                HandleNewLike(SockMsg.data);
                break
            
            case MSG:
                HandleShatNewMsg(SockMsg.data)
                break

            default:
                LogUnknownActionData(SockMsg)
                break

        }
    }

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
            var old = [];
            var new_ = [];
            
            for(let i = 0; i < Data.length; i++) {
                const NotificationObj = Data[i];
                
                if(!Boolean(NotificationObj.seen)) {
                    new_.push(NotificationObj);
                    continue
                }
                console.log("new")
                old.push(NotificationObj);
            }

            setFetchedNotifications(old);
            setnotCount(p => new_.length + p);
            setNotificationPool(new_);
        })

        .catch(e => console.log(e))
    }
    
    const AuthUser = () => {
        // Gets user using the json web token!

        SubmitJWT()
        .then((res) => {
            return res.json()
        })

        .then((Json) => {
            
            if(Json.code === 200) {
                var user = Json.data;
                dispatch(login(user));
            } else {
                dispatchNotificationEvent({
                    text: `${Json.data}`,
                    status: "error"
                })
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
    }

    const OnAuth = () => {
        // Initiate a connection with the backend if the user is authenticated !
        if(User) {
            
            if(SocketConn === null) {
                var s = useSocket(User.id_, onMessageCallback);
                setSocketConn(s);    
            }

            fetchOldNotifications();
        }
    }
    
    const FlushNewMessagesAfterUse = () => setNewMsgs([]);

    const ResetAppState = () => {
        // Reset state.
        setSocketConn(null);
        freeNotificationPool();
        setFetchedNotifications([]);
        flushNewLikes([]);
        FlushNewMessagesAfterUse();
        setnotCount(0);
        flushNewComments(0);
        flushNewPosts([]);
        setNewMsgs([]);
        freefuncPool();
    }  

    const dispatchNotificationEvent = (ob) => {
        
        setNotification({
            ...ob,
            id: NotificationID
        });

        setID(o => o + 1)
    }

    
    // Effects
    useEffect(() => {

        if(JWT()) {
            AuthUser()
        } else {
            setLoading(false);
        }

        return () => setLoading(true);
    
    }, []);

    useEffect(() => {
        OnAuth();
        return ResetAppState;
    }, [User])

    return (
        <>
            {
                (User && !Loading) ? (
                        <>
                            <NavBar NewMsgCount={NewMessageCount} UserImg={User.img} NewNotificationCount={notCount}/>
                            { ("setPosts" in FuncPool) ? <FloatingPostFormUI setPosts={FuncPool["setPosts"]} NotificationFunc={dispatchNotificationEvent} /> : "" }
                            <Routes>
                                <Route path="/" element={<Home NewPosts={NewPosts} NewComments={NewComments} NewLikes={NewLikes} FlushNewPosts={flushNewPosts} FlushNewComments={flushNewComments} FlushNewLikes={flushNewLikes} NotificationFunc={dispatchNotificationEvent} funcPoolManager={AddToPool} />} />
                                <Route path="/Home" element={<Home NewPosts={NewPosts} NewLikes={NewLikes} NewComments={NewComments} FlushNewPosts={flushNewPosts} FlushNewComments={flushNewComments} FlushNewLikes={flushNewLikes} NotificationFunc={dispatchNotificationEvent} funcPoolManager={AddToPool} />} />
                                <Route path="/chat" element={<ChatUI flushMessages={FlushNewMessagesAfterUse} User={User} NewMessages={NewMsgs} NotificationFunc={dispatchNotificationEvent} Conn={SocketConn} />} />
                                <Route path="/Login" element={<Login NotificationFunc={dispatchNotificationEvent} />} />
                                <Route path="/Signup" element={<SignUp NotificationFunc={dispatchNotificationEvent}/>} />
                                <Route path="/profile" element={<CurrentUserProfile NotificationFunc={dispatchNotificationEvent}/>}/>
                                <Route path="/Notifications" element={<UserNotifications socketConn={SocketConn} Notifications={FetchedNotifications} CountCallback={setnotCount} FreeNotificationPool={freeNotificationPool} NotificationPool={notificationPool}/>} />
                                <Route path="/i" element={<Icons NotificationFunc={dispatchNotificationEvent} />} />
                                <Route path="/Accounts" element={<AccountsSearchPannel CurrUserId={User.id_} NotificationFunc={dispatchNotificationEvent} />}/>

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
                { 
                    (Notification) ? <ApplicationNotification msg={Notification.text} StyleKey={Notification.status} id={NotificationID}/> : ("")
                }
            </div>
        </>
    );
}

export default  App;