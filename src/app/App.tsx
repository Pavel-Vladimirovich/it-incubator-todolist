import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "./store";
import {StatusRequest} from "./app_reducer";
import {Container, CssBaseline, Grid, LinearProgress, Paper, ThemeProvider, Typography} from "@material-ui/core";
import HideAppBar from "../components/MenuAppBar/HideAppBar";
import {AddItemForm} from "../components/AddItemForm/AddItemForm";
import {Todolist} from "../features/Todolist/Todolist";
import {
    changeTodolistFilter,
    createTodolistAsync,
    fetchTodolistAsync,
    FilterValuesType, removeTodolistAsync, TodolistDomainType
} from "../features/Todolist/todolist-reducer";
import { CustomizedSnackbars } from "../components/Snackbar/Snackbar";
import { theme } from "../utils/themeUI";
import { makeStyles } from '@material-ui/core/styles';

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

function App() {
    // console.log("render app")
    const classes = useStyles()
    const dispatch = useDispatch<any>()
    const todolists = useSelector<AppStateType, Array<TodolistDomainType>>((state => state.todolists));
    //const statusRequest = useSelector<AppStateType, StatusRequest>((state => state.app.status))
    const status = useSelector<AppStateType, StatusRequest>((state) => state.app.status)
   
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
            <ThemeProvider theme={theme}>
            <CssBaseline />
            <HideAppBar/>
            <CustomizedSnackbars/>
            <div className={classes.linearProgressContainer}>{status === StatusRequest.loading && <LinearProgress color={'primary'} className={classes.linearProgress}/>}</div>
            <Container maxWidth="xl">
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
                                    elevation={3}
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
            </Container>
            </ThemeProvider> 
        </>
    );
}

export default App;
