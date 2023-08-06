import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import App from "./app/App";
import {Provider} from "react-redux";
import {store} from "./app/store";
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import {Login} from "./features/Login/Login";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <div>Error</div>
    },
    {
        path: "/login",
        element: <Login />,
    },
]);


ReactDOM.render(
    <Provider store={store}>
        <RouterProvider router={router} />
    </Provider>
    ,document.getElementById("root"));
serviceWorker.unregister();
