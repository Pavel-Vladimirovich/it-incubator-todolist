import {Grid, Paper, Typography} from "@material-ui/core";
import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {useNavigate} from "react-router-dom";
import {AddItemForm} from "../../components";
import {useAppDispatch, useDispatchedActions} from "../../hooks/useAppDispatch";
import {Todolist, todolistActions} from "../Todolist";
import {authSelectors} from "../Auth";
import {todolistListSelectors} from "./";
import {useStyles} from "./styles";


export const TodolistList = () => {

    const dispatch = useAppDispatch()
    const {fetchTodolistAsync} = useDispatchedActions(todolistActions)

    const navigate = useNavigate();

    const todolists = useSelector(todolistListSelectors.selectTodolists);
    const isLoggedIn = useSelector(authSelectors.isLoggedIn);

    const classes = useStyles();

    useEffect(() => {
        if (!isLoggedIn) {
            navigate('login')
        }
        fetchTodolistAsync()
    }, [isLoggedIn, navigate, fetchTodolistAsync])

    const createTodolistHandler = useCallback(async(title: string) => {
        const resultAction = await dispatch(todolistActions.createTodolistAsync({title}))
        if(todolistActions.createTodolistAsync.rejected.match(resultAction) && resultAction.payload?.errors.length){
            throw new Error(resultAction.payload.errors[0])
        }
    }, [dispatch])

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <Typography variant="h1" align="center" color='textSecondary' gutterBottom
                            className={classes.title}>todo <span className={classes.span}>list</span></Typography>
                <AddItemForm
                    addItem={createTodolistHandler}
                    labelMessage="Add a new to-do list..."
                />
            </Grid>
            {todolists.map((tl) => {
                return (
                    <Grid item xs={12} md={4} key={tl.id}>
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