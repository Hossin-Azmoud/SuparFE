import { useState, useEffect } from "react";
import { api } from "../Var";
import UserUI from "./UserUI";
import Loader from "./Loader";

const AccountsSearchPannel = ({ CurrUserId }) => {
	const [Users, setUsers] = useState(null);
    const [Query, setQuery] = useState("");
    

    useEffect(() => {
        // an onmount event to fetch everything from the database/server once the page is loaded
        setUsers(null);
        fetch((Query.length) ? `${api}/query?query=${Query}` : `${api}/query`, {
            headers: {
                "content-type": "application/json",
            },
            method: "GET"
        })
        
        .then((res) => {
            return res.json()
        })
        
        .then((data) => {
            console.log(data);
            setUsers([...data]);
        }).finally(() => {
            console.log(Users);
        })

    }, [Query])

	return (
		<section className="flex sm:w-[500px] w-full flex-col flex-row justify-center items-center"> 
            
            <from className="w-full my-2">
                <input onChange={(e) => setQuery(e.target.value)} className="text-white bg-none border-b border-b-yellow-500 focus:border-sky-400 py-2 px-2 w-full outline-none my-2 bg-black" type="query" placeholder="search">
                </input>
            </from>

            <div className="flex flex-wrap flex-row justify-center items-center">

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
                        <Loader size="50" Class="my-6"/>
                    )
                }

            </div>

        </section>
	)
}

export default AccountsSearchPannel;
