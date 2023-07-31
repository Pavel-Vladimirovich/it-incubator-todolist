import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store";
import {StatusRequest} from "./app_reducer";
import {Container, CssBaseline, Grid, LinearProgress, Paper} from "@material-ui/core";
import HideAppBar from "../components/MenuAppBar/HideAppBar";
import style from "./App.module.scss";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {Todolist} from "../features/Todolist/Todolist";
import {
    changeTodolistFilter,
    createTodolistAsync,
    fetchTodolistAsync,
    FilterValuesType, removeTodolistAsync, TodolistDomainType
} from "../features/Todolist/todolist-reducer";
import { CustomizedSnackbars } from "../components/Snackbar/Snackbar";


function App() {
    // console.log("render app")
    const dispatch = useDispatch<any>()
    const todolists = useSelector<AppStateType, Array<TodolistDomainType>>((state => state.todolists));
    const statusRequest = useSelector<AppStateType, StatusRequest>((state => state.app.status))
    const status = useSelector<AppStateType, StatusRequest>((state) => state.app.status)
    if (statusRequest === StatusRequest.loading) {
        // console.log(statusRequest)
    }
    useEffect(() => {
        dispatch(fetchTodolistAsync())
    }, [dispatch])


    const createTodolistHandler = useCallback((title: string) => {
        dispatch(createTodolistAsync(title))
    }, [dispatch])

    const removeTodolistHandler = useCallback(
        (todolistId: string) => {
            dispatch(removeTodolistAsync(todolistId))
        }, [dispatch])

    const changeTodolistFilterHandler = useCallback(
        (todolistId: string, filterValue: FilterValuesType) => {
            dispatch(changeTodolistFilter(todolistId, filterValue))
        }, [dispatch])
    return (
        <>
            <CssBaseline/>
            <HideAppBar/>
            <div style={{height: '10px'}}>{status === StatusRequest.loading && <LinearProgress color={"primary"} style={{height: '3px'}}/>}</div>
            <Container maxWidth="xl">
            <CustomizedSnackbars/>
                <Grid container spacing={3}>
                    <Grid item xs={12} style={{textAlign: "center", marginTop: "20px"}}>
                        <h1 className={style.header_title}>my to do lists</h1>
                        <AddItemForm
                            addItem={createTodolistHandler}
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
                                        changeFilter={changeTodolistFilterHandler}
                                        filter={tl.filter}
                                        entityStatus={tl.entityStatus}
                                        removeTodolist={removeTodolistHandler}
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
