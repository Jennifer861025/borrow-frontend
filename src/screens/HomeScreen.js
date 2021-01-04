import React, { useEffect, useContext, useState } from 'react';
// import items from '../json/items.json'
import { Link } from "react-router-dom";
import axios from "axios";

import { StateContext, DispatchContext, HeaderContext } from "../contexts";
import actionType, { SERVER_URL } from "../constants";
import '../index.css'

const today = new Date();
const currentMonth = today.getMonth();
const currentYear = today.getFullYear();
const currentDay = today.getDate();

const HomeScreen = () => {
  const { userSignin, itemsInfo } = useContext(StateContext);
  const { isLogin } = userSignin;
  const { items, loading, error } = itemsInfo;
  const dispatch = useContext(DispatchContext);
  const [headerContext, setHeaderContext] = useContext(HeaderContext);
  const [itemType, setItemType] = useState(items);

  var items_key;
  var items_equipment;

  if (items.length != 0 && items) {
    items_key = (items || []).filter((x) => x.type === "key");
    items_equipment = (items || []).filter((x) => x.type === "equipment");
  }

  useEffect(() => {
    const changeHeaderTitle = () => {
      setHeaderContext("借用物品")
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
    // console.log(items);
    items_key = (items || []).filter((x) => x.type === "key");
    items_equipment = (items || []).filter((x) => x.type === "equipment");
    if (items.length != 0 && items) {
      setItemType(items);
    }
  }, [items]);

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

  const itemAllOnclick = () => {
    document.querySelector("#all").classList.add("select");
    document.querySelector("#key").classList.remove("select");
    document.querySelector("#equipment").classList.remove("select");
    setItemType(items);
  }
  const itemKeyOnclick = () => {
    document.querySelector("#key").classList.add("select");
    document.querySelector("#all").classList.remove("select");
    document.querySelector("#equipment").classList.remove("select");
    setItemType(items_key);
  }
  const itemEquipmentOnclick = () => {
    document.querySelector("#equipment").classList.add("select");
    document.querySelector("#key").classList.remove("select");
    document.querySelector("#all").classList.remove("select");
    setItemType(items_equipment);
  }

  return (
    <div className="content">
      <aside className="sidebar">
        <ul>
          <li>
            <button className="sideBar-btn select" id="all" onClick={itemAllOnclick}>
              <i className="fa fa-th-large" aria-hidden="true"></i>
                  所有物品
                </button>
          </li>
          <li>
            <button className="sideBar-btn" id="key" onClick={itemKeyOnclick}>
              <i className="fa fa-key" aria-hidden="true"></i>
                  教室鑰匙
                </button>
          </li>
          <li>
            <button className="sideBar-btn" id="equipment" onClick={itemEquipmentOnclick}>
              <i className="fa fa-plug" aria-hidden="true"></i>
                  器材
                </button>
          </li>
        </ul>
      </aside>

      {loading ? (
        // <LoadingBox></LoadingBox>
        <div>loading</div>
      ) : error ? (
        // <MessageBox variant="danger">{error}</MessageBox>
        <div>{error}</div>
      ) : (
            <div className="items">
              {itemType.map((item) => (
                <div key={item._id} className="item">
                  <div className={`${isLended(item.alreadyBorrowDate) ? "label" : "label display-none"}`}>
                    <div className="label-p">本日已借用</div>
                  </div>
                  <div className="item-box">
                    <div className="item-photo">
                      <img src={"../" + item.image} alt="" className="item-photo-img"></img>
                    </div>
                    <div className="item-name">{item.name}</div>
                    <Link to={isLogin === false ? "/Login" : "/Borrow/" + item._id}><button className="primary-btn-L item-borrowBtn">借用物品</button></Link>
                  </div>
                </div>
              ))}
            </div>
          )}

    </div>
  );
}

export default HomeScreen;