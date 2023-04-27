import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App_useReducer from "./App_useReducer";

ReactDOM.render(<App_useReducer/>,document.getElementById("root"));
serviceWorker.unregister();
