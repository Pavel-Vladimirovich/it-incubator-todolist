import React from "react";
import {CssBaseline, ThemeProvider} from "@material-ui/core";
import {theme} from "../utils/comonStyleThemeUI";
import {Outlet} from "react-router-dom";
import {Layout} from "../components/Layout";



function App() {
    // console.log("render app")
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
