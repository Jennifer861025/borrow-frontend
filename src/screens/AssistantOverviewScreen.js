import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";
// import items from '../json/items.json'
import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/assistant_overview.css'

const today = new Date();
const currentDay = today.getDate();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const todayDate = currentYear.toString() + "-" + + (currentMonth + 1).toString() + "-" + currentDay.toString();

const AssistantOverviewScreen = () => {
    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    const { borrowInfo, itemsInfo } = useContext(StateContext);
    const { items, loading, error } = itemsInfo;
    const { borrowItems, borrowLoading, borrowError } = borrowInfo;
    const dispatch = useContext(DispatchContext);

    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("物品總覽")
        }
        changeHeaderTitle()
    });

    useEffect(() => {
        async function fetchData() {
            try {
                dispatch({ type: actionType.RESERVED_ITEMS_REQUEST });
                const { data } = await axios.post(SERVER_URL + "/api/reserved/overview", {
                    reservedDate: todayDate
                });
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

    useEffect(() => {
        async function fetchData() {
          try {
            dispatch({ type: actionType.ITEM_LIST_REQUEST });
            const { data } = await axios.get(SERVER_URL + "/api/items");
            dispatch({ type: actionType.ITEM_LIST_SUCCESS, payload: data });
          } catch (error) {
            dispatch({
              type: actionType.ITEM_LIST_FAIL,
              payload: error.message,
            });
          }
        }
        fetchData();
      }, []);

    const changeState = async (reservedState, borrowId) => {
        // dispatch({ type: actionType.BORROW_REMOVE_ITEM, payload: borrowId });
        try {
            await axios.put(SERVER_URL + "/api/reserved/" + borrowId + "/changeState", {
                reservedState
            });
            dispatch({ type: actionType.RESERVED_ITEMS_REQUEST });
            const { data } = await axios.post(SERVER_URL + "/api/reserved/today", {
                reservedDate: todayDate
            });
            console.log(data);
            dispatch({ type: actionType.RESERVED_GET_ITEMS, payload: data });
        } catch (error) {
            alert(error);
        }
    };

    const removeBorrow = async (borrowId, name, alreadyBorrowDate, stuNumber) => {
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
        } catch (error) {
            alert(error);
        }
    };

    const isLended = (alreadyBorrowDay) => {
        var dayCorrect = false;
        if (alreadyBorrowDay != []) {
          alreadyBorrowDay.forEach(element => {
            var dateArr = element.split("-");
            if (dateArr[0] === currentYear.toString() && dateArr[1] === (currentMonth + 1).toString() && dateArr[2]=== currentDay.toString()) {
              dayCorrect = true
            } 
          });
          if(dayCorrect === true){
            return true;
          }
          else{
            return false;
          }
        }
        else {
          return false;
        }
      }

    return (
        <div className="assistant_overviewContent">
            <aside className="sidebar">
                <ul>
                    <li>
                        <Link to={"/AssistantOverview"}>
                            <button className="sideBar-btn select" onclick="SideBar(event)">
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
                            <button className="sideBar-btn" onclick="SideBar(event)">
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
            <div className="assistant_overview-content">
                <div className="today_reserved content_box">
                    <div className="title">
                        <p>今日預約</p>
                        <p>{todayDate}</p>
                    </div>
                    {borrowLoading ? (
                        // <LoadingBox></LoadingBox>
                        <div>loading</div>
                    ) : borrowError ? (
                        // <MessageBox variant="danger">{error}</MessageBox>
                        <div>{borrowError}</div>
                    ) : (
                                <div>
                                    {borrowItems.length <= 1 ? (
                                        <div className="personal-borrowRecord-none1"><i class="fa fa-history" aria-hidden="true"></i><p>今日尚未有預約</p></div>
                                    ) : (
                                            <div>
                                                <p className="obj_name">{borrowItems[0].name}</p>
                                                <div className="reserved_content">
                                                    <div className="reserved-photo">
                                                        <img src={"../" + borrowItems[0].image} alt="" className="reserved-photo-img"></img>
                                                    </div>
                                                    <div>
                                                        <div className="reserved_info">
                                                            <table>
                                                                <tr>
                                                                    <th>借物學生</th>
                                                                    <td>{borrowItems[0].stuNumber} &nbsp; <span>{borrowItems[0].stuName}</span></td>
                                                                    <th>借物理由</th>
                                                                    <td>{borrowItems[0].reservedReason}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>聯絡電話</th>
                                                                    <td>{borrowItems[0].stuPhone}</td>
                                                                    <th>拿取時間</th>
                                                                    <td>{borrowItems[0].getTime}</td>
                                                                </tr>
                                                                <tr>
                                                                    <th>E-mail</th>
                                                                    <td colspan="3">{borrowItems[0].stuEmail}</td>
                                                                </tr>
                                                            </table>
                                                        </div>
                                                    </div>
                                                    {borrowItems[0].reservedState == "已預約" ?
                                                        <div className="btnArea-col">
                                                            <button className="primary-btn-M-O" onClick={() => changeState(borrowItems[0].reservedState, borrowItems[0]._id)}>借出</button>
                                                            <button className="secondary-btn-M" onClick={() => removeBorrow(borrowItems[0]._id, borrowItems[0].name, borrowItems[0].reservedDate, borrowItems[0].stuNumber)}>取消預約</button>
                                                        </div> : null
                                                    }
                                                    {borrowItems[0].reservedState == "已借出" ?
                                                        <button className="primary-btn-M-O" onClick={() => returnBorrow(borrowItems[0].reservedState, borrowItems[0]._id, borrowItems[0].name, borrowItems[0].reservedDate, borrowItems[0].stuNumber)}>歸還</button>
                                                        : null
                                                    }
                                                </div>
                                            </div>
                                        )}
                                </div>
                            )}

                    <Link to={"/AssistantToday"} className="more_reserved">
                        <i className="fa fa-chevron-down" aria-hidden="true"></i>
                    </Link>
                </div>
                <div className="obj_status content_box">
                    <div className="title">
                        <p>物品狀態</p>
                        <Link to={"/AssistantBorrow"}>
                            <button>
                                <i className="fa fa-external-link" aria-hidden="true"></i>
                                &nbsp;管理物品
                                </button>
                        </Link>
                    </div>
                    {loading ? (
                        // <LoadingBox></LoadingBox>
                        <div>loading</div>
                    ) : error ? (
                        // <MessageBox variant="danger">{error}</MessageBox>
                        <div>{error}</div>
                    ) : (<div>
                        <table>
                            {items.map((item) => (
                                <tr>
                                    <td>{item.name}</td>
                                    <td>{isLended(item.alreadyBorrowDate) ? "已借出" : "尚未借出"}</td>
                                </tr>
                            ))}
                        </table>
                    </div>)}
                </div>
                <div className="newest_reserved content_box">
                    <div className="title">
                        <p>最新預約</p>
                        <Link to={"/AssistantReserved"}>
                            <button>
                                <i className="fa fa-external-link" aria-hidden="true"></i>
                                &nbsp;查看預約
                                </button>
                        </Link>
                    </div>
                    <div>
                        <div className="newest_content">
                            {borrowItems.length == 0 ? (
                                <div className="personal-borrowRecord-none"><i class="fa fa-history" aria-hidden="true"></i><p>今日尚未有預約</p></div>
                            ) : (
                                    <div>
                                        {borrowItems.length > 0 ?
                                            <div>
                                                <p className="obj_name">{borrowItems[borrowItems.length - 1].name}</p>
                                                <div className="reserved-photo">
                                                    <img src={"../" + borrowItems[borrowItems.length - 1].image} alt="" className="reserved-photo-img"></img>
                                                </div>
                                            </div>
                                            : null}
                                    </div>
                                )}
                            <div>
                                <div className="reserved_info">
                                    {borrowItems.length == 0 ? (
                                        <div className="personal-borrowRecord-none"></div>
                                    ) : (
                                            <div>
                                                {borrowItems.length > 0 ?
                                                    <table>
                                                        <tr>
                                                            <th>借物學生</th>
                                                            <td>{borrowItems[borrowItems.length - 1].stuNumber} &nbsp; <span>{borrowItems[borrowItems.length - 1].stuName}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <th>借用日期</th>
                                                            <td>{borrowItems[borrowItems.length - 1].reservedDate}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>借物理由</th>
                                                            <td>{borrowItems[borrowItems.length - 1].reservedReason}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>拿取時間</th>
                                                            <td>{borrowItems[borrowItems.length - 1].getTime}</td>
                                                        </tr>
                                                    </table>
                                                    : null}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>

                        <hr />

                        <div className="newest_content">
                            {borrowItems.length <= 1 ? (
                                <div className="personal-borrowRecord-none"><i class="fa fa-history" aria-hidden="true"></i><p>今日尚未有預約</p></div>
                            ) : (
                                    <div>
                                        {borrowItems.length > 1 ?
                                            <div>
                                                <p className="obj_name">{borrowItems[borrowItems.length - 2].name}</p>
                                                <div className="reserved-photo">
                                                    <img src={"../" + borrowItems[borrowItems.length - 2].image} alt="" className="reserved-photo-img"></img>
                                                </div>
                                            </div>
                                            : null}
                                    </div>
                                )}
                            <div>
                                <div className="reserved_info">
                                    {borrowItems.length <= 1 ? (
                                        <div className="personal-borrowRecord-none"></div>
                                    ) : (
                                            <div>
                                                {borrowItems.length > 1 ?
                                                    <table>
                                                        <tr>
                                                            <th>借物學生</th>
                                                            <td>{borrowItems[borrowItems.length - 2].stuNumber} &nbsp; <span>{borrowItems[borrowItems.length - 2].stuName}</span></td>
                                                        </tr>
                                                        <tr>
                                                            <th>借用日期</th>
                                                            <td>{borrowItems[borrowItems.length - 2].reservedDate}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>借物理由</th>
                                                            <td>{borrowItems[borrowItems.length - 2].reservedReason}</td>
                                                        </tr>
                                                        <tr>
                                                            <th>拿取時間</th>
                                                            <td>{borrowItems[borrowItems.length - 2].getTime}</td>
                                                        </tr>
                                                    </table>
                                                    : null}
                                            </div>
                                        )}
                                </div>
                            </div>
                        </div>
                        
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AssistantOverviewScreen;