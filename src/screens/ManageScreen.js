import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
// import items from '../json/items.json'
import axios from "axios";
// import Calendar from "../components/CalendarDay"
import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/manage.css'

//-------------------------
const today = new Date();
const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDate = today.getDate();
var nodate;
var nextMonth = currentMonth + 1;
var cantChooseCantBorrowDate = [];
var cantChooseAlreadyBorrowDate = [];
var datePushArray = [];
var datePushArray1 = [];
var item = {};

if (currentMonth == 11) {
    nextMonth = 0;
}

//-------------------------

const ManageScreen = (props) => {
    const [itemnull, setItemnull] = useState(true);
    const { itemsInfo } = useContext(StateContext);
    const { items, loading, error } = itemsInfo;
    const dispatch = useContext(DispatchContext);

    if (items.length != 0 && items) {
        item = items.find(
            (x) => x._id === props.match.params.id
        );
    }

    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("管理物品")
        }
        changeHeaderTitle()
    });

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

    useEffect(() => {
        if (items.length != 0 && items) {
            item = items.find(
                (x) => x._id === props.match.params.id
            );
        }

    }, [items]);

    function daysInMonth(month, year) {
        return 32 - new Date(year, month, 32).getDate();
    }

    function showDays(month, year, i) {
        if(itemnull === false){
        var date = i * 7 - nodate + 1
        var days = []
        var firstDay = new Date(year, month).getDay();
        var daysMonth = daysInMonth(month, year);
        for (var j = 0; j < 7; j++) {
            if (i === 0 && j < firstDay) {
                days.push(
                    <td></td>
                )
                nodate++;
            } else if (date > daysMonth) {
                break;
            } else {
                function findCantBorrowDate(num) {
                    for (var v = 0; v < cantChooseCantBorrowDate.length; v++) {
                        if (num.toString() === cantChooseCantBorrowDate[v]) {
                            return true;
                        }
                    }
                }
                function findAlreadyBorrowDate(num) {
                    for (var v = 0; v < cantChooseAlreadyBorrowDate.length; v++) {
                        if (num.toString() === cantChooseAlreadyBorrowDate[v]) {
                            return true;
                        }
                    }
                }
                if (findCantBorrowDate(date) === true || (month === currentMonth && date < currentDate)) {
                    days.push(
                        <td value={date} className="date-picker gray-text">
                            <span>{date}</span>
                        </td>
                    )
                } else if (findAlreadyBorrowDate(date) === true) {
                    days.push(
                        <td value={date} className="date-picker selected">
                            <span>{date}</span>
                        </td>
                    )
                }
                else {
                    days.push(
                        <td value={date} className="date-picker">
                            <span>{date}</span>
                        </td>
                    )
                }

                date++
            }
        }
        return (days);
        }
        
    }

    function showCalendar(month, year) {
        if (itemnull === false) {
            cantChooseDate(month);
            var weeks = []
            nodate = 0

            for (var i = 0; i < 6; i++) {
                weeks.push(
                    <tr>
                        {showDays(month, year, i)}
                    </tr>
                )
            }
            return (weeks);
        }

    }

    function cantChooseDate(month) {
        cantChooseCantBorrowDate = [];
        cantChooseAlreadyBorrowDate = [];
        datePushArray = [];
        datePushArray1 = [];
        if (itemnull === false) {
                if (item.cantBorrowDate != null && item.cantBorrowDate.length>=0) {
                    item.cantBorrowDate.forEach(element => {
                        var dateArr = element.split("-");
                        if (dateArr[0] === currentYear.toString() && dateArr[1] === (month + 1).toString()) {
                            datePushArray.push(dateArr[2]);
                            cantChooseCantBorrowDate = Array.from(new Set(datePushArray));
                        }
                    });
                }
                if (item.alreadyBorrowDate != null && item.alreadyBorrowDate.length>=0) {
                    item.alreadyBorrowDate.forEach(element => {
                        var dateArr = element.split("-");
                        if (dateArr[0] === currentYear.toString() && dateArr[1] === (month + 1).toString()) {
                            datePushArray1.push(dateArr[2]);
                            cantChooseAlreadyBorrowDate = Array.from(new Set(datePushArray1));
                            console.log(cantChooseAlreadyBorrowDate);
                        }
                    });
                }
            }
    }

    useEffect(() => {
        cantChooseCantBorrowDate = [];
        cantChooseAlreadyBorrowDate = [];
        datePushArray = [];
        datePushArray1 = [];
    }, [item]);

    useEffect(() => {
        if (item != null && item._id != undefined) {
            setItemnull(false);
        }
        else {
            setItemnull(true);
        }
    }, [item]);

    const rednerCalender = (currentMonth) => {
        if (itemnull === false) {
            return (
                showCalendar(currentMonth, currentYear)
            )
        }
        else{
            <div>loading</div>
        }

    }

    return (
        <div>
            {loading ? (
                // <LoadingBox></LoadingBox>
                <div> loading</div >
            ) : error ? (
                // <MessageBox variant="danger">{error}</MessageBox>
                <div>{error}</div>
            ) : (
                        <div className="manage-content">
                            <div className="photoArea">
                                <div className="largePhoto">
                                    <img src={"../" + item.image} alt=""></img>
                                </div>
                                <div className="threeSmallPhoto">
                                    <div className="smallPhoto">
                                        <img src={"../" + item.image} alt=""></img>
                                    </div>
                                    <div className="smallPhoto">
                                        <img src={"../" + item.image} alt=""></img>
                                    </div>
                                    <div className="smallPhoto">
                                        <img src={"../" + item.image} alt=""></img>
                                    </div>
                                </div>
                            </div>
                            <div className="detailArea">
                                <div className="descriptionArea">
                                    <div className="titleSection">
                                        <label className="item-name" for="">{item.name}</label>
                                        <Link to={"/BorrowRecord/"+item._id}>
                                            <button className="primary-btn-M-B" name={item.name}>租借紀錄</button>
                                        </Link>
                                    </div>
                                    <div className="line"></div>
                                    <div className="rule">
                                        <label for="">租借規範</label>
                                        <p>
                                        {item.rules.map((rule) => (
                                            <div>{rule}<br></br></div>
                                        ))}
                                        </p>
                                    </div>
                                </div>
                                <div className="calendarArea">
                                    <div class="container-calendar">
                                        <div class="button-container-calendar">
                                            <p id="monthHeader">{monthsArr[currentMonth]}</p>
                                        </div>

                                        <table class="table-calendar" id="calendar">
                                            <thead id="thead-month">
                                                <tr>
                                                    {daysArr.map((dhead) => (
                                                        <th data-days={dhead}>{dhead}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody id="calendar-body">
                                                {/* {showCalendar(currentMonth, currentYear)} */}
                                                {rednerCalender(currentMonth)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="calendarArea">
                                    <div class="container-calendar">
                                        <div class="button-container-calendar">
                                            <p id="monthHeader">{monthsArr[nextMonth]}</p>
                                        </div>

                                        <table class="table-calendar" id="calendar">
                                            <thead id="thead-month">
                                                <tr>
                                                    {daysArr.map((dhead) => (
                                                        <th data-days={dhead}>{dhead}</th>
                                                    ))}
                                                </tr>
                                            </thead>
                                            <tbody id="calendar-body">
                                                {/* {showCalendar(currentMonth + 1, currentYear)} */}
                                                {rednerCalender(currentMonth+1)}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                                <div className="btnArea">
                                    <Link to={"/AssistantBorrow"}><button className="secondary-btn-M">返回</button></Link>
                                    <Link to={"/" + item._id + "/Edit"}><button className="primary-btn-M-B">編輯</button></Link>
                                </div>
                            </div>
                        </div>
                    )}
        </div>
    );
}

export default ManageScreen;