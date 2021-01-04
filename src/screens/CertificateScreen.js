import React, { useEffect, useState, useContext } from 'react';
import { Link } from "react-router-dom";

import { StateContext, DispatchContext, HeaderContext } from "../contexts"
import actionType from "../constants";
import '../css/personal.css'

const CertificateScreen = (props) => {
    const [headerContext, setHeaderContext] = useContext(HeaderContext);
    const { userSignin, borrowInfo, itemsInfo } = useContext(StateContext);
    const { userInfo } = userSignin;
    const { items, loading, error } = itemsInfo;
    const { borrowItems } = borrowInfo;
    const dispatch = useContext(DispatchContext);
    useEffect(() => {
        const changeHeaderTitle = () => {
            setHeaderContext("憑證")
        }
        changeHeaderTitle()
    });

    const item = borrowItems.find(
        (x) => x._id === props.match.params.id
    );

    return (
        <div className="personal-content">
            <div className="personal-detail">
                <div className="name">{userInfo.name}</div>
                <div className="number">{userInfo.number}</div>
            </div>
            <div className="line"></div>
            <div className="personal-borrow-certificate" key={item._id}>
                <div className="item-photo">
                    <img src={"../" + item.image} alt=""></img>
                </div>
                <div>
                    <table>
                        <tr>
                            <th>物品名稱</th>
                            <td>{item.name}</td>
                            <th>狀態</th>
                            <td> <div className="item-status-lable item-status-reserved">{item.reservedState}</div></td>
                            <td>{/* 這裡是被拒絕的理由 */}</td>
                        </tr>
                        <tr>
                            <th>借用理由</th>
                            <td>{item.reservedReason}</td>
                            <th>聯絡電話</th>
                            <td>{item.stuPhone}</td>
                        </tr>
                        <tr>
                            <th>借用日期</th>
                            <td>{item.reservedDate}</td>
                            <th>E-mail</th>
                            <td colspan="2">{item.stuEmail}</td>
                        </tr>
                        <tr>
                            <th>拿取時間</th>
                            <td>{item.getTime}</td>
                        </tr>
                        {/* <tr>
                            <th>歸還日期</th>
                            <td>－</td>
                        </tr> */}
                    </table>
                </div>
            </div>
            <div className="btnArea">
                <Link to={"/Personal/"}>
                    <button className="secondary-btn-M">返回</button>
                </Link>
            </div>
        </div>
    );
}

export default CertificateScreen;