import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";
import axios from "axios";
// import Calendar from "../components/CalendarDay"
import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/edit.css'

//-------------------------
const today = new Date();
const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDate = today.getDate();
var nodate;
var nextMonth = currentMonth + 1;
var cantBorrowDate = [];
var cantChooseCantBorrowDate = [];
var cantChooseAlreadyBorrowDate = [];
var datePushArray = [];
var datePushArray1 = [];
var item = {};
var ruleString = '';

if (currentMonth == 11) {
    nextMonth = 0;
}

//-------------------------

const EditScreen = (props) => {
    const [itemnull, setItemnull] = useState(true);
    const { itemsInfo } = useContext(StateContext);
    const { items, loading, error } = itemsInfo;
    const dispatch = useContext(DispatchContext);
    const [name, setName] = useState("");
    const history = useHistory();

    var rules

    if (items.length != 0 && items) {
        item = items.find(
            (x) => x._id === props.match.params.id
        );
    }

    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("編輯物品")
        }
        changeHeaderTitle()
    });

    useEffect(() => {
        async function fetchData() {
            try {
                dispatch({ type: actionType.ITEM_LIST_REQUEST });
                const { data } = await axios.get(SERVER_URL + "/api/items");
                dispatch({ type: actionType.ITEM_LIST_SUCCESS, payload: data });
                setName(item.name)
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

    const submitHandler = async () => {
        console.log(name)
        // e.preventDefault();
        dispatch({
            type: actionType.ITEM_DETAILS_UPDATE_REQUEST
        });
        rules = document.getElementById("ruleTextarea").value.replace(/\r\n/g,"\n").split("\n");
        try {
            const { data } = await axios.put(SERVER_URL + "/api/items/" + props.match.params.id + "/edit", {
                name,
                cantBorrowDate,
                rules
            });
            dispatch({ type: actionType.ITEM_DETAILS_UPDATE_SUCCESS, payload: data });
            //   Cookie.set("userInfo", JSON.stringify(data));
            history.push("/Manage/" + props.match.params.id);
        } catch (error) {
            dispatch({
                type: actionType.ITEM_DETAILS_UPDATE_FAIL,
                payload: error.message,
            });
        }
    }

    const clickedDate = (e) => {
        if (e.className == "date-picker") {
            e.className = "date-picker selected"
            cantBorrowDate.push(e.getAttribute('data-year') + "-" + e.getAttribute('data-month') + "-" + e.getAttribute('data-date'));
        } else {
            e.className = "date-picker"
            const index = cantBorrowDate.indexOf(e.getAttribute('data-year') + "-" + e.getAttribute('data-month') + "-" + e.getAttribute('data-date'));
            if (index !== -1) {
                cantBorrowDate.splice(index, 1);
            }
        }
        console.log(cantBorrowDate);
    };
    
    function daysInMonth(month, year) {
        return 32 - new Date(year, month, 32).getDate();
    }
    
    function showDays(month, year, i) {
        if(itemnull === false){
        var date = i * 7 - nodate + 1
        var days = []
        var firstDay = new Date(year, month).getDay();
        var daysMonth = daysInMonth(month, year);
        cantChooseCantBorrowDate = [];
        cantChooseAlreadyBorrowDate = [];
        datePushArray = [];
        datePushArray1 = [];
        cantChooseDate(month);
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
                if (month === currentMonth && date < currentDate) {
                    days.push(
                        <td data-date={date} data-month={month + 1} data-year={year} className="date-picker gray-text">
                            <span>{date}</span>
                        </td>
                    )
                }
                else if (findAlreadyBorrowDate(date) === true) {
                    days.push(
                        <td data-date={date} data-month={month + 1} data-year={year} className="date-picker cantSelected">
                            <span>{date}</span>
                        </td>
                    )
                }
                else if (findCantBorrowDate(date) === true) {
                    // var class_name = "date-picker selected"
                    // const index = cantBorrowDate.indexOf(year.toString() + "-" + (month + 1).toString() + "-" + date.toString());
                    // if (index !== -1) {
                    //     class_name = "date-picker"
                    // }
                    days.push(
                        <td data-date={date} data-month={month + 1} data-year={year} className="date-picker selected" onClick={(e) => clickedDate(e.currentTarget)}>
                            <span>{date}</span>
                        </td>
                    )
                }
                else {
                    // var class_name = "date-picker"
                    // const index = cantBorrowDate.indexOf(year.toString() + "-" + (month + 1).toString() + "-" + date.toString());
                    // if (index !== -1) {
                    //     class_name = "date-picker selected"
                    // }
                    days.push(
                        <td data-date={date} data-month={month + 1} data-year={year} className="date-picker" onClick={(e) => clickedDate(e.currentTarget)}>
                            <span>{date}</span>
                        </td>
                    )
                }
    
                date++
            }
        }
        return (days);
    }}
    
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
            cantBorrowDate = item.cantBorrowDate;
        }
        else {
            setItemnull(true);
        }
        ruleString = '';
        for(var i=0; i<item.rules.length;i++){
            ruleString+=item.rules[i]+"\n"
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
                <div> loading</div>
            ) : error ? (
                // <MessageBox variant="danger">{error}</MessageBox>
                <div>{error}</div>
            ) : (
                        <div className="editContent">
                            <div className="photoArea">
                                <div className="icon-btn-S deleteBtn">
                                    <i className="fa fa-times " aria-hidden="true"></i>
                                </div>
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
                                        <div className="icon-btn-M">
                                            <i className="fa fa-plus" aria-hidden="true"></i>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="detailArea">
                                <div className="descriptionArea">
                                    <input className="item-name-input" type="text" defaultValue={item.name} onChange={(e) => setName(e.target.value)}></input>
                                    <div className="line"></div>
                                    <div className="rule">
                                        <label for="">租借規範</label>
                                        {/* <!-- &#10 換行符號 --> */}
                                        <textarea id="ruleTextarea">
                                            {ruleString}
                                        </textarea>
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
                                    <Link to={"/Manage/" + props.match.params.id}>
                                        <button className="secondary-btn-M">取消</button>
                                    </Link>
                                    <button className="primary-btn-M-O" onClick={submitHandler}>確定</button>
                                </div>
                            </div>
                        </div>
                    )}
        </div>
    );
}

export default EditScreen;