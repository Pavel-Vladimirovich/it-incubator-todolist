import React, {useEffect} from "react";
import {CssBaseline, Grid, ThemeProvider} from "@material-ui/core";
import { CircularProgress } from '@material-ui/core';
import {Outlet} from "react-router-dom";
import {Layout} from "../components/Layout";
import {useSelector} from "react-redux";
import {AppRootState} from "./store";
import {appInitializationAsync} from "./app_reducer";
import { theme } from "../styles/common";
import { useAppDispatch, useAppSelector } from "../hooks/useAppDispatch";

function App() {
    const dispatch = useAppDispatch()
    const isInitialization = useSelector<AppRootState, boolean>((state) => state.app.isInitialization)

    const a: any = useAppSelector()
    console.log(a.app)
    
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
