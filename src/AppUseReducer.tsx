import React, {useCallback} from "react";
import {useDispatch, useSelector} from "react-redux";
import style from "./App.module.scss";
import {Todolist} from "./components/Todolist/Todolist";
import { AddItemForm } from "./components/AddItemForm/AddItemForm";
import {Container, Grid, Paper} from "@material-ui/core";
import HideAppBar from "./components/MenuAppBar/HideAppBar";
import {addTodolistAC, changeTodolistFilterAC, FilterValuesType, removeTodolistAC, TodolistType} from "./state/todolist-reducer";
import {AppStateType} from "./state/store";


function App() {
    console.log("render app")
    const dispatch = useDispatch()
    const todolists = useSelector<AppStateType, Array<TodolistType>>((state => state.todolists));

    const addTodolist = useCallback((title: string) => {
        dispatch(addTodolistAC(title))
    }, [dispatch])

    const removeTodolist = useCallback(
        (todolistId: string) => {
        dispatch(removeTodolistAC(todolistId))
    }, [dispatch])

    const changeTodolistFilter = useCallback(
        (todolistId: string, filterValue: FilterValuesType) => {
            dispatch(changeTodolistFilterAC(todolistId, filterValue))
        }, [dispatch])

    return (
        <>
            <HideAppBar/>
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} style={{textAlign: "center", marginTop: "20px"}}>
                        <h1 className={style.header_title}>my todolists</h1>
                        <AddItemForm
                            addItem={addTodolist}
                            textMessage="Todolist created successfully!"
                            labelMessage="Add a new to-do list..."
                        />
                    </Grid>
                    {todolists.map((tl) => {
                        return (
                            <Grid item xs={12} md={6} key={tl.id}>
                                <Paper
                                    elevation={3}
                                    variant="outlined"
                                    style={{padding: "10px"}}>
                                    <Todolist
                                        id={tl.id}
                                        key={tl.id}
                                        title={tl.title}
                                        changeFilter={changeTodolistFilter}
                                        filter={tl.filter}
                                        removeTodolist={removeTodolist}
                                    />
                                </Paper>
                            </Grid>
                        );
                    })}
                </Grid>
            </Container>
        </>
    );
}

export default App;
