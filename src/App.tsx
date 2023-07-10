import React, {useCallback, useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import style from "./App.module.scss";
import {Todolist} from "./components/Todolist/Todolist";
import {AddItemForm} from "./components/AddItemForm/AddItemForm";
import {Container, Grid, Paper} from "@material-ui/core";
import HideAppBar from "./components/MenuAppBar/HideAppBar";
import {
    changeTodolistFilterAC, fetchTodolistTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType, createTodolistTC
} from "./state/todolist-reducer";
import {AppStateType} from "./state/store";
import {
    TodolistType,
    todolistsAPI,
    TaskStatus,
    TaskPriority,
} from "./api/todolist-api";



function App() {
    //console.log("render app")
    useEffect(() => {
        dispatch(fetchTodolistTC())
    }, [])

    const dispatch = useDispatch<any>()
    const todolists = useSelector<AppStateType, Array<TodolistDomainType>>((state => state.todolists));

    const createTodolist = useCallback((title: string) => {
        dispatch(createTodolistTC(title))
    }, [dispatch])

    const removeTodolist = useCallback(
        (todolistId: string) => {
            dispatch(removeTodolistTC(todolistId))
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
                        <h1 className={style.header_title}>my to do lists</h1>
                        <AddItemForm
                            addItem={createTodolist}
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
                                        todolistId={tl.id}
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
