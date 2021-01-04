import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import Cookie from "js-cookies"
import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/login.css'
import axios from "axios";
import users from '../json/user.json'

const LoginScreen = (props) => {
    const [number, setNumber] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useContext(DispatchContext);
    const { userSignin, error } = useContext(StateContext);
    const { userInfo } = userSignin;

    const submitHandler = (e) => {
        e.preventDefault();
        verifyUser(number,password);
    }

    const getBorrowItems = async (number) => { 
        try {
            const { data } = await axios.post(SERVER_URL + "/api/reserved/user", {
                number
            });
            dispatch({ type: actionType.RESERVED_GET_ITEMS, payload: data });
            props.history.push("/");
        } catch (error) {
            alert(error)
        }
    };

    const verifyUser = async (number, password) => { 
        try {
            const { data } = await axios.post(SERVER_URL + "/api/users/login", {
                number, password
            });
            dispatch({ type: actionType.USER_SIGNIN_SUCCESS, payload: data });
            if(data.identity === "student"){
                getBorrowItems(number);
            }
            else{
                props.history.push("/AssistantOverview");
            }
        } catch (error) {
            if(error.message == "Request failed with status code 402"){
                alert("密碼錯誤");
            }else if(error.message == "Request failed with status code 401"){
                alert("帳號密碼錯誤");
            }
        }

        // const data = users.find(
        //     (x) => x.number === number 
        // );
        // if (data){
        //     if (data.password === password) {
        //         dispatch({
        //             type: actionType.USER_SIGNIN_SUCCESS,
        //             payload: {
        //                 name: data.name,
        //                 number: data.number,
        //                 identity: data.identity,
        //             }
        //         });
        //         if(data.identity === "student"){
        //             props.history.push("/");
        //         }
        //         else{
        //             props.history.push("/AssistantOverview");
        //         }
        //     }
        //     else{
        //         alert("密碼錯誤");
        //     }
        // }
        // else{
        //     alert("帳號密碼錯誤");
        // }
    };

    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("登入")
        }
        changeHeaderTitle()
    });

    return (
        <div class="login-content">
            <form onSubmit={submitHandler}>
                <div class="login-title">帳號登入</div>
                <div class="login-box">
                    <div class="account">
                        <div class="login-input">
                            <label for="">帳號</label>
                            <input type="text" onChange={(e) => setNumber(e.target.value)}></input>
                        </div>
                        <p class="description">學生請輸入學生證，助教請輸入教職員編號</p>
                    </div>
                    <div class="password">
                        <div class="login-input">
                            <label for="">密碼</label>
                            <input type="password" onChange={(e) => setPassword(e.target.value)}></input>
                        </div>
                        <p class="description">系統預設身分證末四碼</p>
                    </div>
                    <button type="submit" class="primary-btn-L login-btn">登入</button>
                </div>
            </form>

        </div>
    );
}

export default LoginScreen;