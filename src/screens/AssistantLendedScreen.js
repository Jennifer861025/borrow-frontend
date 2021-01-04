import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/assistant_today.css'

const AssistantLendedScreen = () => {
    const { borrowInfo } = useContext(StateContext);
    const { borrowItems, borrowLoading, borrowError } = borrowInfo;
    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("物品總覽-已借出")
        }
        changeHeaderTitle()
    });

    useEffect(() => {
        async function fetchData() {
            try {
                dispatch({ type: actionType.RESERVED_ITEMS_REQUEST });
                const { data } = await axios.get(SERVER_URL + "/api/reserved/lended");
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

    const returnBorrow = async (reservedState, borrowId, name, alreadyBorrowDate, stuNumber) => {
        dispatch({ type: actionType.BORROW_REMOVE_ITEM, payload: borrowId });
        try {
            await axios.put(SERVER_URL + "/api/reserved/" + borrowId + "/changeState", {
                reservedState
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

    const removeUserReserved = async (number, reservedName, reservedDate) => {
        try {
            await axios.put(SERVER_URL + "/api/users/deleteReserved", {
                number,
                reservedName,
                reservedDate
            });
            // dispatch({ type: actionType.USER_UPDATE_RESERVED, payload: data });
            // console.log(data);
        } catch (error) {
            alert(error);
        }
    };

    return (
        <div className="assistant_today-content">
            <aside className="sidebar">
                <ul>
                    <li>
                        <Link to={"/AssistantOverview"}>
                            <button className="sideBar-btn" onclick="SideBar(event)">
                                <i className="fa fa-align-justify" aria-hidden="true"></i>
                                總覽
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/AssistantToday"}>
                            <button className="sideBar-btn" onclick="SideBar(event)">
                                <i className="fa fa-calendar-o" aria-hidden="true"></i>
                                今日預約
                            </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/AssistantReserved"}>
                            <button className="sideBar-btn" onclick="SideBar(event)">
                                <i className="fa fa-clock-o" aria-hidden="true"></i>
                                已預約
                                </button>
                        </Link>
                    </li>
                    <li>
                        <Link to={"/AssistantLended"}>
                            <button className="sideBar-btn select" onclick="SideBar(event)">
                                <i className="fa fa-sign-out" aria-hidden="true"></i>
                                已借出
                            </button>
                        </Link>
                    </li>
                </ul>
                <div>
                    <hr />
                    <Link to={"/AssistantBorrow"}>
                        <button className="sideBar-btn">
                            <i className="fa fa-cog" aria-hidden="true"></i>
                            管理物品
                            </button>
                    </Link>
                </div>
            </aside>
            {borrowLoading ? (
                // <LoadingBox></LoadingBox>
                <div>loading</div>
            ) : borrowError ? (
                // <MessageBox variant="danger">{error}</MessageBox>
                <div>{borrowError}</div>
            ) : (
                        <div className="today_content">
                            {borrowItems.length === 0 ? (
                                <div className="personal-borrowRecord-none"><i class="fa fa-history" aria-hidden="true"></i><p>尚未有借用預約</p></div>
                            ) : (
                                    borrowItems.map((item, index) => (
                                        <div>
                                            { (index == 0 || (index > 0 && item.reservedDate != borrowItems[index - 1].reservedDate)) ?
                                                <div className="today_date">
                                                    <p>{item.reservedDate}</p>
                                                </div> : null
                                            }
                                            <div className="content_box">
                                                <div>
                                                    <p className="obj_name">{item.name}</p>
                                                    <div className="reserved_content">
                                                        <div className="reserved-photo">
                                                            <img src={"../" + item.image} alt="" className="reserved-photo-img"></img>
                                                        </div>
                                                        <div>
                                                            <div className="reserved_info">
                                                                <table>
                                                                    <tr>
                                                                        <th>借物學生</th>
                                                                        <td>{item.stuNumber} &nbsp; <span>{item.stuName}</span></td>
                                                                        <th>借物理由</th>
                                                                        <td>{item.reservedReason}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>聯絡電話</th>
                                                                        <td>{item.stuPhone}</td>
                                                                        <th>拿取時間</th>
                                                                        <td>{item.getTime}</td>
                                                                    </tr>
                                                                    <tr>
                                                                        <th>E-mail</th>
                                                                        <td colspan="3">{item.stuEmail}</td>
                                                                    </tr>
                                                                </table>
                                                            </div>
                                                        </div>
                                                        <button className="primary-btn-M-O" onClick={() => returnBorrow(item.reservedState, item._id, item.name, item.reservedDate, item.stuNumber)}>歸還</button>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )
                            }
                        </div>
                    )}
        </div>
    );
}

export default AssistantLendedScreen;