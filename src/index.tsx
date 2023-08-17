import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import {Provider} from "react-redux";
import {store} from "./app/store";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Login} from "./features/Login";
import {TodolistList} from "./features/TodolistList/TodolistList";
import {ErrorPage} from "./features/ErrorPage";
import { Clock } from "./components/Clock";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <ErrorPage/>,
        children:[
            {
                path: "/",
                element: <TodolistList/>,
            },
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/clock",
                element: <Clock/>,
            },
        ]
    },
    
]);


ReactDOM.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
    ,document.getElementById("root"));
serviceWorker.unregister();
