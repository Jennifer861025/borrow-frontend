import React, { useEffect, useContext, useReducer, useState } from 'react';
import { Link } from "react-router-dom";
import { StateContext, DispatchContext, HeaderContext } from "../contexts";
import actionType from "../constants";

const Header = () => {
    const { userSignin } = useContext(StateContext);
    const { userInfo } = userSignin;
    const [headerContext , setHeaderContext] = useContext(HeaderContext);
    const dispatch = useContext(DispatchContext);

    const personLogin=()=> {
        if (userInfo.identity ==="student") {
            document.querySelector("#student").classList.remove("display-none");
            document.querySelector("#login").classList.add("display-none");
            document.querySelector("#teacher").classList.add("display-none");
        }
        else if(userInfo.identity ==="teacher"){
            document.querySelector("#student").classList.add("display-none");
            document.querySelector("#login").classList.add("display-none");
            document.querySelector("#teacher").classList.remove("display-none");
        }
        else{
            document.querySelector("#teacher").classList.add("display-none");
            document.querySelector("#student").classList.add("display-none");
            document.querySelector("#login").classList.remove("display-none");
        }
    }

    useEffect(() => {
        personLogin();
    }, [userInfo.identity]);

    return (
        <header className="header">
            <Link to={userInfo.identity === "teacher" ? "/AssistantOverview" : "/"}>
                <div className="header-title">
                    <div className="dtd">數位科技設計學系｜</div>
                    <div className="page_name">{headerContext}</div>
                </div>
            </Link>
            <div className="header-login display-none" id="student">
                <Link to="/Personal">{userInfo.name}</Link>
            </div>

            <div className="header-login display-none" id="teacher">
                <Link to="/Login" onClick={()=>dispatch({type:actionType.USER_LOGOUT})}>{userInfo.name+"登出"}</Link>
            </div>

            <div className="header-login" id="login">
                <Link to={"/Login"}>會員登入</Link>
            </div>
        </header>
    );
}

export default Header;
