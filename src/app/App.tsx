import React from "react";
import {Container, CssBaseline, ThemeProvider} from "@material-ui/core";
import HideAppBar from "../components/MenuAppBar/HideAppBar";
import {CustomizedSnackbars} from "../components/Snackbar/Snackbar";
import {theme} from "../utils/comonStyleThemeUI";
import {Outlet} from "react-router-dom";



function App() {
    // console.log("render app")
    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline/>
                <HideAppBar/>
                <CustomizedSnackbars/>
                <Container maxWidth="xl">
                    <Outlet/>
                </Container>
            </ThemeProvider>
        </>
    );
}

export default App;
