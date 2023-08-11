import React, {useEffect} from "react";
import {CssBaseline, Grid, ThemeProvider} from "@material-ui/core";
import { CircularProgress } from '@material-ui/core';
import {Outlet} from "react-router-dom";
import {Layout} from "../components/Layout";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store";
import {appInitializationAsync} from "./app_reducer";
import { theme } from "../styles/theme-UI";

function App() {
    const dispatch = useDispatch<any>()
    const isInitialization = useSelector<AppStateType, boolean>((state) => state.app.isInitialization)

    useEffect(()=>{
        dispatch(appInitializationAsync())
    }, [dispatch])

    if(!isInitialization){
         return(
            <Grid container justifyContent="center" alignItems="center" style={{height: "100vh"}}>
                <CircularProgress color="primary" />
            </Grid>
         )  
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
