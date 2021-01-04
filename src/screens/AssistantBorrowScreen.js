import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
// import items from '../json/items.json'
import axios from "axios";

import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/assistant_borrow.css'

const AssistantBorrowScreen = () => {
    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    const { itemsInfo } = useContext(StateContext);
    const { items, loading, error } = itemsInfo;
    const dispatch = useContext(DispatchContext);
    const [itemType, setItemType] = useState(items);
    const [itemLended, setItemLended] = useState(null);
    const [itemArray, setItemArray] = useState(items);

    var items_key;
    var items_equipment;

    if (items.length != 0 && items) {
        items_key = (items || []).filter((x) => x.type === "key");
        items_equipment = (items || []).filter((x) => x.type === "equipment");
    }

    // changeHeaderTitle
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
        // console.log(items);
        items_key = (items || []).filter((x) => x.type === "key");
        items_equipment = (items || []).filter((x) => x.type === "equipment");
        if (items.length != 0 && items) {
            setItemType(items);
        }
    }, [items]);

    useEffect(() => {
        if (itemLended === null) {
            setItemArray(itemType)
        }
        else {
            setItemArray(itemType.filter((x) => x.lended === itemLended));
        }
    }, [itemType, itemLended]);

    // select itemType
    //  const items_key = items.filter((x) => x.type === "key");
    //  const items_equipment = items.filter((x) => x.type === "equipment");
    // const items_lended = itemType.filter((x) => x.lended === true);
    // const items_notLended = itemType.filter((x) => x.lended === false);

    // asideBtn OnClick
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

    const allItemOnclick = () => {
        document.querySelector("#allItem").classList.add("select");
        document.querySelector("#lended").classList.remove("select");
        document.querySelector("#notLended").classList.remove("select");
        setItemLended(null);
    }
    const lendedOnclick = () => {
        document.querySelector("#lended").classList.add("select");
        document.querySelector("#allItem").classList.remove("select");
        document.querySelector("#notLended").classList.remove("select");
        setItemLended(true);
    }

    const notLendedOnclick = () => {
        document.querySelector("#notLended").classList.add("select");
        document.querySelector("#allItem").classList.remove("select");
        document.querySelector("#lended").classList.remove("select");
        setItemLended(false);
    }


    return (
        <div>
            <Link to={"/Add"}>
                <div className="icon-btn-L assistant_borrow_plusBtn">
                    <i className="fa fa-plus" aria-hidden="true"></i>
                </div>
            </Link>
            <div className="assistant_borrow-content">
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
                    <div>
                        <hr />
                        <Link to={"/AssistantOverview"}>
                            <button className="sideBar-btn">
                                <i className="fa fa-calendar-o" aria-hidden="true"></i>
                                今日預約
                            </button>
                        </Link>
                    </div>
                </aside>
                <div className="assistant_borrowContent">
                    <div className="borrow-filter">
                        <button className="filter-btn select" id="allItem" onClick={allItemOnclick}>
                            全部
                        </button>
                        <button className="filter-btn" id="lended" onClick={lendedOnclick}>
                            已借出
                        </button>
                        <button className="filter-btn" id="notLended" onClick={notLendedOnclick}>
                            未借出
                        </button>
                    </div>

                    {loading ? (
                        // <LoadingBox></LoadingBox>
                        <div>loading</div>
                    ) : error ? (
                        // <MessageBox variant="danger">{error}</MessageBox>
                        <div>{error}</div>
                    ) : (
                                <div className="items">
                                    {itemArray.map((item) => (
                                        <div className="item">
                                            <div className="item-box">
                                                <div className="item-photo">
                                                    <img src={"../" + item.image} alt="" className="item-photo-img"></img>
                                                </div>
                                                <div className="item-name">{item.name}</div>
                                                <Link to={"/Manage/" + item._id}><button className="primary-btn-L-B">管理</button></Link>
                                            </div>
                                        </div>
                                    ))}

                                </div>
                            )}
                </div>

            </div>
        </div>

    );
}

export default AssistantBorrowScreen;