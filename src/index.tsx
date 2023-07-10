import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import {Provider} from "react-redux";
import {store} from "./app/store";

ReactDOM.render(
    <Provider store={store}>
        <App/>
    </Provider>
    ,document.getElementById("root"));
serviceWorker.unregister();
