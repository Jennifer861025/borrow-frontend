import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
// import items from '../json/items.json'
import axios from "axios";
// import Calendar from "../components/CalendarDay_single"
import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/borrow.css'

//----------------------
const today = new Date();
const monthsArr = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const daysArr = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDate = today.getDate();
var chooseDate = "";
var nodate;
var cantChooseDate = [];
var datePushArray = [];

const clickedDate = (e) => {
    var preSelect = document.querySelector(".date-picker.selected");
    if (preSelect) {
        preSelect.className = "date-picker";
        e.className = "date-picker selected";
    } else {
        e.className = "date-picker selected";
    }
    chooseDate = currentYear.toString() + "-" + (currentMonth + 1).toString() + "-" + e.getAttribute('value');
};

function daysInMonth(month, year) {
    return 32 - new Date(year, month, 32).getDate();
}

function showDays(month, year, i) {

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
            function findNum(num) {
                for (var v = 0; v < cantChooseDate.length; v++) {
                    if (num.toString() === cantChooseDate[v]) {
                        return true;
                    }
                }
            }
            if (findNum(date) === true || date < currentDate) {
                days.push(
                    <td value={date} className="date-picker gray-text">
                        {/* className={`${state.open ? "date-picker selected" : "date-picker"}`}> */}
                        <span>{date}</span>
                    </td>
                )
            }
            else {
                days.push(
                    <td value={date} className="date-picker" onClick={(e) => clickedDate(e.currentTarget)}>
                        {/* className={`${state.open ? "date-picker selected" : "date-picker"}`}> */}
                        <span>{date}</span>
                    </td>
                )
            }
            date++
        }
    }
    return (days);
}


//----------------------

const BorrowScreen = (props) => {
    const { itemsInfo, userSignin } = useContext(StateContext);
    const { userInfo } = userSignin;
    const { items, loading, error } = itemsInfo;
    const { name, number } = userInfo;
    const dispatch = useContext(DispatchContext);

    var item = {};
    // var selectedIndex = -1;
    const [stuPhone, setStuPhone] = useState("");
    const [stuEmail, setStuEmail] = useState("");
    const [reservedReason, setReservedReason] = useState("");
    const [getTime, setGetTime] = useState("");
    const [itemnull, setItemnull] = useState(true);

    if (items.length != 0 && items) {
        item = items.find(
            (x) => x._id === props.match.params.id
        );
    }
    function showCalendar(month, year) {
        if (itemnull === false) {
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

    const saveBorrowItem = async () => {
        try {
            const { data } = await axios.post(SERVER_URL + "/api/reserved/add", {
                name: item.name,
                image: item.image,
                stuName: name,
                stuNumber: number,
                stuPhone,
                stuEmail,
                reservedDate: chooseDate,
                reservedReason,
                getTime
            });
            // dispatch({ type: actionType.RESERVED_ADD_ITEM, payload: data });
            //   Cookie.set("userInfo", JSON.stringify(data));
            props.history.push("/Personal");
        } catch (error) {
            alert(error);
        }
    }

    const handleAddToBorrow = async () => {
        //selectReason()
        console.log(reservedReason);
        //if (selectedIndex >= 0) {
        if (reservedReason.length > 0) {
            if (getTime.length > 0) {
                try {
                    const { data } = await axios.put(SERVER_URL + "/api/users/addReserved", {
                        number,
                        reservedName: item.name,
                        reservedDate: chooseDate
                    });
                    await axios.put(SERVER_URL + "/api/items/" + props.match.params.id + "/addAlreadyBorrowDate", {
                        alreadyBorrowDate: chooseDate
                    });
                    // dispatch({ type: actionType.USER_UPDATE_RESERVED, payload: data });
                    //   Cookie.set("userInfo", JSON.stringify(data));
                    saveBorrowItem();
                } catch (error) {
                    alert(error);
                }
            } else {
                alert("沒有選擇拿取時間");
            }
        } else {
            alert("沒有輸入租借理由");
        }
    }
    // else {
    //     alert("沒有選擇租借理由");
    // }

    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("借用物品");
        }
        changeHeaderTitle()
    });

    // useEffect(()=>{
    //     handleAddToBorrow();
    // },[reservedReason]);

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

    useEffect(() => {
        cantChooseDate = [];
        datePushArray = [];
        console.log("xxx=" + cantChooseDate);
        console.log(item.alreadyBorrowDate);
        console.log(item)
        
        if (itemnull === false) {
            if (item.cantBorrowDate!=null && item.cantBorrowDate.length > 0) {
                item.cantBorrowDate.forEach(element => {
                    var dateArr = element.split("-");
                    if (dateArr[0] === currentYear.toString() && dateArr[1] === (currentMonth + 1).toString()) {
                        datePushArray.push(dateArr[2]);
                        cantChooseDate = Array.from(new Set(datePushArray));
                    }
                });
            }
            if (item.alreadyBorrowDate!=null && item.alreadyBorrowDate.length > 0) {
                item.alreadyBorrowDate.forEach(element => {
                    var dateArr = element.split("-");
                    if (dateArr[0] === currentYear.toString() && dateArr[1] === (currentMonth + 1).toString()) {
                        datePushArray.push(dateArr[2]);
                        cantChooseDate = Array.from(new Set(datePushArray));
                    }
                });
            }
        }
    }, [item, itemnull]);

    useEffect(() => {
        if (item != null && item._id != undefined) {
            setItemnull(false);
        }
        else {
            setItemnull(true);
        }
    }, [item]);

    const rednerCalender = () => {
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
                        <div className="borrowContent">
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
                                    <label className="item-name" for="">{item.name}</label>
                                    <div className="line"></div>
                                    <div className="rule">
                                        <label for="">租借規範</label>
                                        <p>＊教室不能吃東西<br></br>＊務必在16:30 之前歸還鑰匙</p>
                                    </div>
                                </div>
                                <div className="reserved_area">
                                    <label className="item-name" for="">輸入借用資訊</label>
                                    <div className="line"></div>
                                    <div className="reserved_form">
                                        <div className="reserved_row">
                                            <label for="" className="reserved_label">手機</label>
                                            <input type="tel" name="" id="" className="reserved_input" onChange={(e) => setStuPhone(e.target.value)}></input>
                                        </div>
                                        <div className="reserved_row">
                                            <label for="" className="reserved_label">E-mail</label>
                                            <input type="email" name="" id="" className="reserved_input" onChange={(e) => setStuEmail(e.target.value)}></input>
                                        </div>
                                        <div className="reserved_row">
                                            <label for="" className="reserved_label">借用理由</label>
                                            <div className="reason_option">
                                                <label><input type="radio" name="reason" id="" onClick={() => setReservedReason("系上活動需要")}></input>系上活動需要</label>
                                                <label><input type="radio" name="reason" id="" onClick={() => setReservedReason("系學會需要")}></input>系學會需要</label>
                                                <label><input type="radio" name="reason" id="" onClick={() => setReservedReason("系上課程需要")}></input>系上課程需要</label>
                                                <label><input type="radio" name="reason" id="" onClick={() => setReservedReason("系上球隊需要")}></input>系上球隊需要</label>
                                                <label><input type="radio" name="reason" id="" onClick={() => setReservedReason("系上社團需要")}></input>系上社團需要</label>
                                                <label><input type="radio" name="reason" id=""></input>其他 <input type="text" className="reserved_input" onChange={(e) => setReservedReason(e.target.value)}></input></label>
                                            </div>
                                        </div>
                                        <div>
                                            <label for="" className="reserved_label">借用日期</label>
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
                                                            {rednerCalender()}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="reserved_row">
                                            <label for="" className="reserved_label">拿取時間</label>
                                            <input type="time" name="" id="" min="09:00" max="17:00" onChange={(e) => setGetTime(e.target.value)}></input>
                                        </div>
                                    </div>
                                </div>
                                <div className="btnArea">
                                    <Link to={"/"}>
                                        <button className="secondary-btn-M">取消</button>
                                    </Link>
                                    <button type="submit" className="primary-btn-M-O" onClick={handleAddToBorrow}>確定</button>
                                </div>
                            </div>
                        </div>
                    )}
        </div>
    );
}

export default BorrowScreen;