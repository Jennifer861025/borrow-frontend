import React from 'react'
import {Route, Switch} from "react-router-dom";
import HomeScreen from '../screens/HomeScreen';
import AddScreen from '../screens/AddScreen'
import AssistantBorrowScreen from '../screens/AssistantBorrowScreen'
import AssistantLendedScreen from '../screens/AssistantLendedScreen'
import AssistantOverviewScreen from '../screens/AssistantOverviewScreen'
import AssistantReservedScreen from '../screens/AssistantReservedScreen'
import AssistantTodayScreen from '../screens/AssistantTodayScreen'
import BorrowRecordScreen from '../screens/BorrowRecordScreen'
import BorrowScreen from '../screens/BorrowScreen'
import CertificateScreen from '../screens/CertificateScreen'
import EditScreen from '../screens/EditScreen'
import LoginScreen from '../screens/LoginScreen'
import ManageScreen from '../screens/ManageScreen'
import PersonalScreen from '../screens/PersonalScreen'

const Main = () =>{
    return (
        <main class="main">
            <Switch>
                <Route path="/" exact={true} component={HomeScreen}/>
                <Route path="/Add" component={AddScreen}/>
                <Route path="/AssistantBorrow" component={AssistantBorrowScreen}/>
                <Route path="/AssistantLended" component={AssistantLendedScreen}/>
                <Route path="/AssistantOverview" component={AssistantOverviewScreen}/>
                <Route path="/AssistantReserved" component={AssistantReservedScreen}/>
                <Route path="/AssistantToday" component={AssistantTodayScreen}/>
                <Route path="/BorrowRecord/:id" component={BorrowRecordScreen}/>
                <Route path="/Borrow/:id" component={BorrowScreen}/>
                <Route path="/Certificate/:id?" component={CertificateScreen}/>
                <Route path="/:id/Edit" component={EditScreen}/>
                <Route path="/Login" component={LoginScreen}/>
                <Route path="/Manage/:id" component={ManageScreen}/>
                <Route path="/Personal" component={PersonalScreen}/>

            </Switch>
        </main>
    );
}

export default Main;