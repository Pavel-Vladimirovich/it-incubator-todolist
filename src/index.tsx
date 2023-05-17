import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App_useReducer from "./App_useReducer";
import {Provider} from "react-redux";
import {store} from "./state/store";

ReactDOM.render(
    <Provider store={store}>
        <App_useReducer/>
    </Provider>
    ,document.getElementById("root"));
serviceWorker.unregister();
