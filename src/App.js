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

const App = () => {
    
    const User = useSelector(state => state.User);
    const dispatch = useDispatch();
    const [Loading, setLoading] = useState(true);
    
    useEffect(() => {

        if(JWT) {
            SubmitJWT(JWT)
            .then((res) => {
                return res.json()
            })
            
            .then((Json) => {
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
        (User && !Loading) ? (
            <>
                <NavBar UserImg={User.img}/>
                <Routes>
                    
                    <Route path="/" element={<Home/>} />
                    <Route path="/Home" element={<Home/>} />
                    <Route path="/Login" element={<Login/>} />
                    <Route path="/Signup" element={<SignUp/>} />
                    <Route path="/profile" element={<CurrentUserProfile />} />
                    <Route path="/i" element={<Icons />} />
                    <Route path="/Accounts" element={<AccountsSearchPannel CurrUserId={User.id_}/>}/>
                    <Route
                        path="/Accounts/:id"
                        loader={({ params }) => {
                            alert(params.id);
                        }}
                      
                        action={({ params }) => {}}

                        element={<Account />}
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
                    <Route path="/" element={<Login />} />
                    <Route path="/Signup" element={<SignUp/>} />
                    <Route path="/Login" element={<Login/>} />
                </Routes>
            )
        )
    );
}

export default  App;