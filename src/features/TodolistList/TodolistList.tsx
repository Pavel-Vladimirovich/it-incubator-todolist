import { Grid, Paper, Typography } from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import React, { useCallback, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { AppRootState } from "../../app/store";
import { AddItemForm } from "../../components/AddItemForm/AddItemForm";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { theme } from "../../styles/common";
import { Todolist } from "../Todolist/Todolist";
import {
    changeTodolistFilter,
    createTodolistAsync,
    fetchTodolistAsync,
    removeTodolistAsync,
    TodolistDomainType
} from "../Todolist/todolist-reducer";
import {FilterValues} from "../../enums/filterValues";

const useStyles = makeStyles({
    linearProgressContainer: {
        height: "3px"
    },
    linearProgress:{
        height: "3px",
    },
    title:{
        textTransform: "uppercase",
        letterSpacing: ".15rem",
        cursor: "default",
    },
    span: {
        color: theme.palette.primary.main
    }

})

export const TodolistList = () => {
    const dispatch = useAppDispatch();

    const navigate = useNavigate();

    const todolists = useSelector<AppRootState, Array<TodolistDomainType>>((state => state.todolists));
    const isLoggedIn = useSelector<AppRootState, boolean>(state => state.authData.isLoggedIn);

    const classes = useStyles();

    useEffect(()=>{
        if(!isLoggedIn){
            navigate('login')
        }
        dispatch(fetchTodolistAsync())
    }, [dispatch, isLoggedIn, navigate])

    const createTodolistHandler = useCallback((title: string) => {
        dispatch(createTodolistAsync(title))
    }, [dispatch])

    const removeTodolistHandler = useCallback(
        (todolistId: string) => {
            dispatch(removeTodolistAsync(todolistId))
        }, [dispatch])

    const changeTodolistFilterHandler = useCallback(
        (todolistId: string, filterValue: FilterValues) => {
            dispatch(changeTodolistFilter({id: todolistId, filter: filterValue}))
        }, [dispatch])

    return(
        <Grid container spacing={3}>
            <Grid item xs={12} >
                <Typography variant="h1" align="center" color='textSecondary' gutterBottom className={classes.title}>todo <span className={classes.span}>list</span></Typography>
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
                            elevation={8}
                            variant="elevation"
                        >
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
    )
}