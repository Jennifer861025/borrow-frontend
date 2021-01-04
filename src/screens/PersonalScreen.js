import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/personal.css'

const PersonalScreen = (props) => {
    const { userSignin, borrowInfo, itemsInfo } = useContext(StateContext);
    const { userInfo } = userSignin;
    const { items, loading, error } = itemsInfo;
    const { borrowItems, borrowLoading, borrowError } = borrowInfo;
    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("個人資訊");
        }
        changeHeaderTitle()
    });

    useEffect(() => {
        async function fetchData() {
            try {
                dispatch({ type: actionType.RESERVED_ITEMS_REQUEST });
                const { data } = await axios.post(SERVER_URL + "/api/reserved/user", {number:userInfo.number});
                // console.log(data);
                dispatch({ type: actionType.RESERVED_GET_ITEMS, payload: data });
            } catch (error) {
                dispatch({
                    type: actionType.RESERVED_ITEMS_FAIL,
                    payload: error.message,
                });
            }
        }
        fetchData();
    }, []);

    const logOut = () => {
        dispatch({
            type: actionType.USER_LOGOUT,
        });
        props.history.push("/Login")
    }

    const removeBorrow = async (borrowId, name ,alreadyBorrowDate, stuNumber)  => {
        dispatch({ type: actionType.BORROW_REMOVE_ITEM, payload: borrowId });
        try {
            await axios.post(SERVER_URL + "/api/reserved/remove", {
                _id: borrowId
            });
            const { data } = await axios.put(SERVER_URL + "/api/items/findItem", {
                name
            });
            await axios.put(SERVER_URL + "/api/items/" + data._id + "/removeAlreadyBorrowDate", {
                alreadyBorrowDate
            });
            removeUserReserved(stuNumber, name, alreadyBorrowDate);
        } catch (error) {
            alert(error);
        }
    };

    const removeUserReserved = async (number, reservedName ,reservedDate)  => {
        try {
            await axios.put(SERVER_URL + "/api/users/deleteReserved", {
                number,
                reservedName,
                reservedDate
            });
            // dispatch({ type: actionType.USER_UPDATE_RESERVED, payload: data });
        } catch (error) {
            alert(error);
        }
    };

    // useEffect(() =>{
    //     console.log(borrowItems);
    //     console.log(userSignin);
    // }, [borrowItems])

    const handleToCertificate = (borrowId) => {
        props.history.push("/Certificate/" + borrowId);
    };

    return (
        <div className="personal-content">
            <div className="personal-detail-top">
                <div className="detail">
                    <div className="name">{userInfo.name}</div>
                    <div className="number">{userInfo.number}</div>
                </div>
                <div className="logout">
                    <button className="primary-btn-M-B" onClick={logOut}>登出</button>
                </div>
            </div>
            <div className="line"></div>
            <div className="personal-borrowRecord-section">
                <div className="personal-borrowRecord-title">
                    <label for="" className="name">物品名稱</label>
                    <label for="" className="item">物品狀態</label>
                    <label for="" className="item">租借日期</label>
                    <label for="" className="date">拿取時間</label>
                </div>
                {borrowLoading ? (
                // <LoadingBox></LoadingBox>
                <div>loading</div>
            ) : borrowError ? (
                // <MessageBox variant="danger">{error}</MessageBox>
                <div>{borrowError}</div>
            ) : (
                <div>
                {borrowItems.length === 0 ? (
                    <div className="personal-borrowRecord-none"><i class="fa fa-history" aria-hidden="true"></i><p>尚未借用物品</p></div>
                ) : (
                        borrowItems.map((item) => (
                            <div className="personal-borrowRecord" key={props.match.params.id}>
                                <div className="item-area">
                                    <div className="item-photo">
                                        <img src={"../" + item.image} alt="IMAGE"></img>
                                    </div>
                                    <p className="item-name">{item.name}</p>
                                </div>
                                <div className="item-status-lable item-status-reserved">{item.reservedState}</div>
                                <div className="item-date">{item.reservedDate}</div>
                                <div className="item-time">{item.getTime}</div>
                                {item.reservedState == "已預約" ?
                                <div className="btnArea-col">
                                    <button className="primary-btn-M-O" onClick={() => handleToCertificate(item._id)}>查看憑證</button>
                                    <button className="secondary-btn-M" onClick={() => removeBorrow(item._id, item.name, item.reservedDate, item.stuNumber)}>取消預約</button>
                                </div> : null
                                }
                                {item.reservedState == "已借出" ?
                                    <button className="primary-btn-M-O" onClick={() => handleToCertificate(item._id)}>查看憑證</button>
                                : null
                                }
                            </div>
                        ))
                    )
                }
                </div>
                )}
            </div>
        </div>
    );
}

export default PersonalScreen;