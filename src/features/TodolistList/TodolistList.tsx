import React, {useCallback, useEffect} from "react";
import {Container, Grid, Paper, Typography} from "@material-ui/core";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {Todolist} from "../Todolist/Todolist";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../app/store";
import {
    changeTodolistFilter,
    createTodolistAsync,
    fetchTodolistAsync, FilterValuesType,
    removeTodolistAsync,
    TodolistDomainType
} from "../Todolist/todolist-reducer";
import {StatusRequest} from "../../app/app_reducer";
import {AuthDataType} from "../../api/todolist-api";
import {getAuthDataAsync} from "../../app/auth_reducer";
import {makeStyles} from "@material-ui/core/styles";
import {theme} from "../../utils/comonStyleThemeUI";
import {Link} from "react-router-dom";

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
        marginTop: "20px"
    },
    span: {
        color: theme.palette.primary.main
    }

})


export const TodolistList = () => {
    const classes = useStyles()

    const dispatch = useDispatch<any>()
    const todolists = useSelector<AppStateType, Array<TodolistDomainType>>((state => state.todolists));
    //const statusRequest = useSelector<AppStateType, StatusRequest>((state => state.app.status))
    const status = useSelector<AppStateType, StatusRequest>((state) => state.app.status)
    const authData = useSelector<AppStateType, AuthDataType>((state) => state.authData)
    console.log(authData)

    useEffect(() => {
        dispatch(fetchTodolistAsync())
        dispatch(getAuthDataAsync())
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