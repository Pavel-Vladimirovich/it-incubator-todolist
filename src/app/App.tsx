import React from "react";
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import HideAppBar from "../components/MenuAppBar/HideAppBar";
import {CustomizedSnackbars} from "../components/Snackbar/Snackbar";
import {theme} from "../utils/comonStyleThemeUI";
import {TodolistList} from "../features/TodolistList/TodolistList";
import {Outlet} from "react-router-dom";



function App() {
    console.log("render app")
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <HideAppBar/>
                <CustomizedSnackbars/>
                <TodolistList/>
                <Outlet/>
            </ThemeProvider>
        </>
    );
}

export default App;
