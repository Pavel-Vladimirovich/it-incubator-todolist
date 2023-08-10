import React, {useEffect} from "react";
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import { CircularProgress } from '@material-ui/core';
import {theme} from "../utils/comonStyleThemeUI";
import {Outlet} from "react-router-dom";
import {Layout} from "../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store";
import {appInitializationAsync} from "./app_reducer";



function App() {
    const dispatch = useDispatch<any>()
    const isInitialization = useSelector<AppStateType, boolean>((state) => state.app.isInitialization)

    useEffect(()=>{
        dispatch(appInitializationAsync())
    }, [dispatch])

    if(!isInitialization){
       return <CircularProgress color="primary" />
    }

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <Layout>
                    <Outlet/>
                </Layout>
            </ThemeProvider>
        </>
    );
}

export default App;
