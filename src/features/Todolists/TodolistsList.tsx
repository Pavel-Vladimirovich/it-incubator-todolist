import React, {useCallback, useEffect} from 'react';
import {useDispatch, useSelector} from "react-redux";
import style from "../../app/App.module.scss";
import {Grid, Paper} from "@material-ui/core";
import {Todolist} from "./Todolist/Todolist";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {AppStateType} from "../../app/store";
import {
    changeTodolistFilterAC,
    createTodolistTC,
    fetchTodolistTC,
    FilterValuesType,
    removeTodolistTC,
    TodolistDomainType
} from "../todolist-reducer";



export const TodolistsList: React.FC = () => {

    const dispatch = useDispatch<any>()
    const todolists = useSelector<AppStateType, Array<TodolistDomainType>>((state => state.todolists));

    useEffect(() => {
        dispatch(fetchTodolistTC())
    }, [])



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
        </>
    );
}

export default TodolistsList;