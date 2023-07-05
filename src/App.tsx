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
    const [todo, setTodo] = useState<Array<TodolistType>>()
    const [tasks, setTasks] = useState<any>()
    const [todoValue, setTodoValue] = useState<string>('')
    const [todoId, setTodoId] = useState<string>('')
    const [response, setResponse] = useState<any>('response')

    useEffect(() => {
        todolistsAPI.getTodolist()
            .then(res => setTodo(res.data))
        // todolistsAPI.getTasks('6b7bc89d-98e3-46a1-868f-145bd3fd3e65')
        //     .then(res => setTasks(res.data.items))

        dispatch(fetchTodolistTC())

    }, [])


    const deleteOnClickHandler = () => {
        todolistsAPI.removeTodolist(todoId)
            .then(res => setResponse(res.data))
    }
    const createOnClickHandler = () => {
        todolistsAPI.createTodolist(todoValue)
            .then(res => setResponse(res.data))
    }
    const changeTitleOnClickHandler = () => {
        todolistsAPI.updateTodolistTitle(todoId, todoValue)
            .then(res => setResponse(res.data))
    }
    const getTasks = () => {
        todolistsAPI.getTasks(todoId)
            .then(res => setTasks(res.data.items))
    }
    const createTask = () => {
        todolistsAPI.createTask(todoId, todoValue)
            .then(res => setResponse(res.data))
    }
    const deleteTask = () => {
        todolistsAPI.removeTask(todoId, todoValue)
            .then(res => setResponse(res.data))
    }
    const updateTask = () => {
        todolistsAPI.updateTask(todoId, todoValue, {
            title: '0909090909 update value',
            description: 'description',
            completed: false,
            status: TaskStatus.New,
            priority: TaskPriority.Low,
            startDate: '19:00',
            deadline: '19:15'
        })
            .then(res => setResponse(res.status))
    }
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
                    <div style={{color: 'blue'}}>{JSON.stringify(todo)}</div>
                    <div style={{color: 'red'}}>{JSON.stringify(tasks)}</div>
                    <div style={{color: 'green'}}>{JSON.stringify(response)}</div>
                    <input placeholder='todoValue' type='text' value={todoValue} onChange={(e) => {
                        setTodoValue(e.currentTarget.value)
                    }}/>
                    <input placeholder='todoId' type='text' value={todoId} onChange={(e) => {
                        setTodoId(e.currentTarget.value)
                    }}/>
                    <button onClick={deleteOnClickHandler}>delete todo</button>
                    <button onClick={createOnClickHandler}>create todo</button>
                    <button onClick={changeTitleOnClickHandler}>change title</button>
                    <button onClick={getTasks}>get tasks</button>
                    <button onClick={createTask}>create tasks</button>
                    <button onClick={deleteTask}>delete task</button>
                    <button onClick={updateTask}>update task</button>
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
