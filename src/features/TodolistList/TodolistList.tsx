import {Grid, Paper, Typography} from "@material-ui/core";
import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {useDispatchedActions} from "../../hooks/useAppDispatch";
import {Todolist} from "../Todolist/Todolist";
import {authSelectors} from "../Auth";
import {selectTodolists} from "./selectors";
import {todolistActions} from "../Todolist";
import {useStyles} from "./styles";


export const TodolistList = () => {
    const {fetchTodolistAsync, createTodolistAsync} = useDispatchedActions(todolistActions)

    const navigate = useNavigate();

    const todolists = useSelector(selectTodolists);
    const isLoggedIn = useSelector(authSelectors.selectIsLoggedIn);

    const classes = useStyles();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('login')
        }
        fetchTodolistAsync()
    }, [isLoggedIn, navigate, fetchTodolistAsync])

    const createTodolistHandler = useCallback((title: string) => {
        createTodolistAsync(title)
    }, [createTodolistAsync])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h1" align="center" color='textSecondary' gutterBottom
                            className={classes.title}>todo <span className={classes.span}>list</span></Typography>
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
                                filter={tl.filter}
                                entityStatus={tl.entityStatus}
                            />
                        </Paper>
                    </Grid>
                );
            })}
        </Grid>
    )
}