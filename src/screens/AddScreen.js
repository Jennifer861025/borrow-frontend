import React, { useEffect, useState, useContext } from 'react';
import { Link, useHistory } from "react-router-dom";

import '../css/add.css';
import axios from "axios";
// import Calendar from "../components/CalendarDay"
import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";

//-------------------------
const today = new Date();
const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
var nodate;
var nextMonth = currentMonth + 1;
var cantBorrowDate = [];

if (currentMonth == 11) {
    nextMonth = 0;
}

for(var i = 1; i<=new Date(currentYear, currentMonth+1, 0).getDate();i++){
    if(new Date(currentYear, currentMonth, i).getDay() == 6|| new Date(currentYear, currentMonth, i).getDay() == 0){
      const thisDate = currentYear.toString() + "-" + (currentMonth + 1).toString() + "-" + i.toString();
      cantBorrowDate.push(thisDate);
    }
}
for(var i = 1; i<=new Date(currentYear, nextMonth+1, 0).getDate();i++){
    if(new Date(currentYear, nextMonth, i).getDay() == 6|| new Date(currentYear, nextMonth, i).getDay() == 0){
      const thisDate = currentYear.toString() + "-" + (nextMonth + 1).toString() + "-" + i.toString();
      cantBorrowDate.push(thisDate);
    }
}
console.log(cantBorrowDate);

const clickedDate = (e) => {
    if(e.className == "date-picker"){
        e.className = "date-picker selected"
        cantBorrowDate.push(e.getAttribute('data-year') + "-" + e.getAttribute('data-month') + "-" + e.getAttribute('data-date'));
    }else{
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

function showDays(month, year, i){
    var date = i*7-nodate+1
    var days = []
    var firstDay = new Date(year, month).getDay();
    var daysMonth = daysInMonth(month, year);
    for(var j = 0; j < 7; j++){
        if(i === 0 && j < firstDay) {
            days.push(
                <td></td>
            )
            nodate++;
        }else if(date > daysMonth){
            break;
        }else{
            const index = cantBorrowDate.indexOf(year.toString() + "-" + (month + 1).toString() + "-" + date.toString());
            if (month === currentMonth && date < today.getDate()){
                days.push(
                <td data-date={date} data-month={month + 1} data-year={year} className="date-picker gray-text">
                    <span>{date}</span>
                </td>
                )
            }else{
                var class_name = "date-picker"
                if (index !== -1) {
                    class_name = "date-picker selected"
                }
                days.push(
                    <td data-date={date} data-month={month + 1} data-year={year} className={class_name} onClick={(e) => clickedDate(e.currentTarget)}>
                        {/* className={`${state.open ? "date-picker selected" : "date-picker"}`}> */}
                        <span>{date}</span>
                    </td>
                )
            }
            date++
        }
    }
    return(days);
}

function showCalendar(month, year){
    var weeks = []
    nodate = 0

    for (var i = 0; i < 6; i++) {
        weeks.push(
            <tr>
                {showDays(month, year, i)}
            </tr>
        )
    }
    return(weeks);
}
//-------------------------

const AddScreen = () => {
    const { itemsInfo } = useContext(StateContext);
    const { loading, error } = itemsInfo;
    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    const dispatch = useContext(DispatchContext);

    const [name, setName] = useState("");
    const history = useHistory();
    var rules

    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("新增物品")
        }
        changeHeaderTitle()
    });

    const submitHandler = async () => {
        console.log(name)
        // e.preventDefault();
        dispatch({
            type: actionType.ITEM_DETAILS_UPDATE_REQUEST
        });
        rules = document.getElementById("ruleTextarea").value.replace(/\r\n/g,"\n").split("\n");
        try {
            const { data } = await axios.post(SERVER_URL + "/api/items/add", {
                name,
                type: "equipment",
                cantBorrowDate,
                rules
            });
            dispatch({ type: actionType.ITEM_DETAILS_UPDATE_SUCCESS, payload: data });
            //   Cookie.set("userInfo", JSON.stringify(data));
            history.push("/AssistantBorrow/")
        } catch (error) {
            dispatch({
                type: actionType.ITEM_DETAILS_UPDATE_FAIL,
                payload: error.message,
            });
        }
    }

    return (
        <div className="add-content">
            <div className="photoArea">
                <div className="icon-btn-S plusBtn">
                    <i className="fa fa-plus" aria-hidden="true"></i>
                </div>
                <div className="title">新增圖片</div>
            </div>
            <div className="detailArea">
                <div className="descriptionArea">
                    <input className="item-name-input" type="text" onChange={(e) => setName(e.target.value)}></input>
                    <div className="line"></div>
                    <div className="rule">
                        <label for="">租借規範</label>
                        <textarea id="ruleTextarea"></textarea>
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
                                {showCalendar(currentMonth, currentYear)}
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
                                {showCalendar(currentMonth + 1, currentYear)}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="btnArea">
                <Link to="/AssistantBorrow">
                        <button className="secondary-btn-M">取消</button>
                    </Link>
                    <button className="primary-btn-M-O" onClick={submitHandler}>確定</button>
                </div>
            </div>
        </div>
    );
}

export default AddScreen;