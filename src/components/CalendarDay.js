import React, { useEffect, useContext } from "react";

var monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
var nodate;

const clickedDate = (e) => {
    if(e.className == "date-picker"){
        e.className = "date-picker selected"
    }else{
        e.className = "date-picker"
    }
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
            days.push(
                <td data-date={date} data-month={month + 1} data-year={year} data-month-name={monthsArr[month]}
                className="date-picker" onClick={(e) => clickedDate(e.currentTarget)}>
                    {/* className={`${state.open ? "date-picker selected" : "date-picker"}`}> */}
                    <span>{date}</span>
                </td>
            )
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

export default showCalendar;