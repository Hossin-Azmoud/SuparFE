import { useState, useEffect } from "react";
import { api, goApi, HOST } from "../../server/Var";
import UserUI from "./UserUI";
import Loader from "./Loader";

const AccountsSearchPannel = ({ 
    CurrUserId, 
    NotificationFunc= () => {} 
}) => {
    // NotificationFunc is used to push a notification.
    /**
     * Usage:
       
        NotificationFunc(
           text: String | number | error,
           status: "error" | "info" | "success" 
        ) 
      
     */
    const [Users, setUsers] = useState(null);
    const [Query, setQuery] = useState("");
    const GetUsersFromApi = (subbed) => {
        if(subbed) {
            fetch((Query.length) ? `${api}/query?q=${Query}` : `${api}/query`, {
            headers: {
                "content-type": "application/json",
            },
            method: "GET"
            })
            
            .then((res) => {
                return res.json()
            })
            
            .then((jsonData) => {
                if(jsonData.code == 200) {
                    var users = [...jsonData.data];
                    if(HOST) {
                        users.map((v) => {
                            v.img = v.img.replace("localhost", HOST);
                            v.bg = v.bg.replace("localhost", HOST);
                        });
                    }

                    setUsers(users);
                    users = null;
                }
            }).catch(e => {
                console.log(e);
            })
        }
    }

    useEffect(() => {
        // an onmount event to fetch everything from the database/server once the page is loaded
        var subscribed = true;
        GetUsersFromApi(subscribed)
        
        return () => { 
            subscribed = false;
            setUsers(null);
        }

    }, [Query])

    return (
        <section className="flex sm:w-[500px] w-full flex-col flex-row justify-center items-center"> 
            
            <form className="w-full my-2">
                <input onChange={(e) => setQuery(e.target.value)} className="text-white bg-none border-b border-b-yellow-500 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 bg-black" type="query" placeholder="search">
                </input>
            </form>

            <div className="flex w-full flex-wrap flex-row justify-center items-center">

                {
                    (Users) ? Users.map((v, i) => {
                        return (CurrUserId != v.id_) ? (
                            <UserUI
                                id_={v.id_}
                                img={v.img}
                                UserName={v.UserName}
                                key={v.id_}
                            />
                        ) : ""
                    }) : (
                        <div className="h-[500px]">
                            <Loader size="20" Class="my-6"/>
                        </div>
                    )
                }

            </div>

        </section>
    )
}

export default AccountsSearchPannel;
