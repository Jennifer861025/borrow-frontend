import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType, { SERVER_URL } from "../constants";
import '../css/borrowRecord.css'

const BorrowRecordScreen = (props) => {
    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    const { itemsInfo, borrowInfo } = useContext(StateContext);
    const { items, loading, error } = itemsInfo;
    const { borrowItems, borrowLoading, borrowError } = borrowInfo;
    const dispatch = useContext(DispatchContext);

    var item = {}

    if (items.length != 0 && items) {
        item = items.find(
            (x) => x._id === props.match.params.id
        );
    }

    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("租借紀錄")
        }
        changeHeaderTitle()
    });

    useEffect(() => {
        async function fetchData() {
            try {
                dispatch({ type: actionType.RESERVED_ITEMS_REQUEST });

                const { data } = await axios.post(SERVER_URL + "/api/reserved/record", {name:item.name});
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

    return (
        <div className="borrowRecord-content">
            {borrowLoading ? (
                // <LoadingBox></LoadingBox>
                <div>loading</div>
            ) : borrowError ? (
                // <MessageBox variant="danger">{error}</MessageBox>
                <div>{borrowError}</div>
            ) : (
                        <div>
                            <div className="item-name">{item.name}</div>
                            <div className="line"></div>
                            <div className="mainContent">
                                <table>
                                    <tr>
                                        <th>借用日期</th>
                                        <th>借物學生</th>
                                        <th>聯絡方式</th>
                                        <th>借用理由</th>
                                        <th>租借狀態</th>
                                        <th>歸還日期</th>
                                    </tr>
                                    {borrowItems.length === 0 ? (
                                        <div className="personal-borrowRecord-none"><i class="fa fa-history" aria-hidden="true"></i><p>尚未有歷史紀錄</p></div>
                                    ) : (
                                            borrowItems.map((borrowitem) => (
                                                <tr>
                                                    <td>{borrowitem.reservedDate}</td>
                                                    <td>{borrowitem.stuNumber}&nbsp; {borrowitem.stuName}</td>
                                                    <td>{borrowitem.stuPhone} <br></br> {borrowitem.stuEmail}</td>
                                                    <td>{borrowitem.reservedReason}</td>
                                                    <td>{borrowitem.reservedState}</td>
                                                    <td>一</td>
                                                </tr>
                                            ))
                                        )}
                                </table>
                            </div>
                        </div>
                    )}
        </div>
    );
}

export default BorrowRecordScreen;