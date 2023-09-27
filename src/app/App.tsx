import React, {useEffect} from "react";
import {CircularProgress, CssBaseline, Grid, ThemeProvider} from "@material-ui/core";
import {Outlet} from "react-router-dom";
import {Layout} from "../components/Layout";
import {useSelector} from "react-redux";
import {appInitializationAsync} from "./app_reducer";
import {theme} from "../styles/common";
import {useAppDispatch} from "../hooks/useAppDispatch";
import {selectIsInitialized} from "./selectors";

function App() {
    const dispatch = useAppDispatch()
    const isInitialization = useSelector(selectIsInitialized)

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
