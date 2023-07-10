import React from "react";
import {Container, Grid} from "@material-ui/core";
import HideAppBar from "../components/MenuAppBar/HideAppBar";
import TodolistsList from "../features/Todolists/TodolistsList";

function App() {
    console.log("render app")
    return (
        <>
            <HideAppBar/>
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <TodolistsList/>
                </Grid>
            </Container>
        </>
    );
}

export default App;
