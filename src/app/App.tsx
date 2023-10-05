import React, {useEffect} from "react";
import {CircularProgress, CssBaseline, Grid, ThemeProvider} from "@material-ui/core";
import {Outlet} from "react-router-dom";
import {Layout} from "../components";
import {useSelector} from "react-redux";
import {appActions, appSelectors} from "./";
import {theme} from "../styles/common";
import {useDispatchedActions} from "../hooks/useAppDispatch";

function App() {
    const isInitialization = useSelector(appSelectors.isInitialization)
    const {appInitializationAsync} = useDispatchedActions(appActions)

    useEffect(() => {
        appInitializationAsync()
    }, [appInitializationAsync])

    if (!isInitialization) {
        return (
            <Grid container justifyContent="center" alignItems="center" style={{height: "100vh"}}>
                <CircularProgress color="primary"/>
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
