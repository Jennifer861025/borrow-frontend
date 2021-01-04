import React, { useReducer, useEffect, useState } from 'react';
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import Cookie from "js-cookies"
import './App.css';
import actionType from "./constants";
import Header from './components/Header'
import Main from './components/Main'

import { StateContext, DispatchContext, HeaderContext } from "./contexts"
import { initialAppState, appReducer } from "./reducers/appReducer"
import axios from "axios";
import './basicSetting.css'
import './button.css'
import './sidebar.css'

function App() {
    const [state, dispatch] = useReducer(appReducer, initialAppState);
    const [headerContext , setHeaderContext] = useState("借用物品");

  return (
    <DispatchContext.Provider value={dispatch}>
            <StateContext.Provider value={state}>
                <HeaderContext.Provider value={[headerContext , setHeaderContext]}>
                  <BrowserRouter>
                    <div class="grid-container">
                        <Header />
                        <Main />
                        <footer class="footer">All right reserved.</footer>
                    </div>
                </BrowserRouter>  
                </HeaderContext.Provider>
            </StateContext.Provider>
        </DispatchContext.Provider>
  );
}

export default App;
