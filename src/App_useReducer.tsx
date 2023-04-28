import React, {useReducer, useState} from "react";
import style from "./App.module.scss";
import { v1 } from "uuid";
import { TaskType, Todolist } from "./components/Todolist/Todolist";
import AddItemForm from "./components/AddItemForm/AddItemForm";
import { Container, Grid, Paper } from "@material-ui/core";
import HideAppBar from "./components/MenuAppBar/HideAppBar";
import {
    addTodolistAC,
    changeTodolistFilterAC,
    changeTodolistTitleAC, removeTodolistAC,
    todolistsReducer
} from "./state/todolists-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, tasksReducer} from "./state/tasks-reducer";

enum FilterValuesType {
    all = "all",
    completed = "completed",
    active = "active",
}

type TodolistType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};
type TasksType = {
    [key: string]: Array<TaskType>;
};

function App() {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let [todolists, dispatchTodolist] = useReducer( todolistsReducer, [
        {
            id: todolistId1,
            title: "What to learn",
            filter: FilterValuesType.all,
        },
        {
            id: todolistId2,
            title: "What to buy",
            filter: FilterValuesType.all,
        },
    ]);

    let [tasks, dispatchTasks] = useReducer( tasksReducer,{
        [todolistId1]: [
            {
                id: v1(),
                title:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
                isDone: false,
                editMode: false,
            },
            {
                id: v1(),
                title:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
                isDone: false,
                editMode: false,
            },
            {
                id: v1(),
                title:
                    "React, Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
                isDone: false,
                editMode: false,
            },
            {
                id: v1(),
                title:
                    "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo ipsa, laborum minus modi non nulla omnis perferendis possimus quam quasi, quidem quod rem reprehenderit repudiandae saepe tenetur. At distinctio eum laudantium, natus perspiciatis quam quod?",
                isDone: false,
                editMode: false,
            },
        ],
        [todolistId2]: [
            { id: v1(), title: "Bread", isDone: false, editMode: false },
            { id: v1(), title: "Milk", isDone: false, editMode: false },
            { id: v1(), title: "Meet", isDone: false, editMode: false },
            { id: v1(), title: "Fish", isDone: false, editMode: false },
        ],
    });

    function addTodolist(title: string) {
        dispatchTodolist(addTodolistAC(title))
        dispatchTasks(addTodolistAC(title))
    }

    function removeTodolist(id: string) {
        dispatchTodolist(removeTodolistAC(id))
        dispatchTasks(removeTodolistAC(id))
    }

    function changeTodolistFilter(todolistId: string, filterValue: FilterValuesType) {
        dispatchTodolist(changeTodolistFilterAC(todolistId, filterValue))
    }

    function changeTodolistTitle(id: string, title: string) {
        dispatchTodolist(changeTodolistTitleAC(id, title))
    }
    function changeTaskTitle(todolistId: string, taskId: string, title: string) {
        dispatchTasks(changeTaskTitleAC(todolistId, taskId, title))
    }

    function removeTask(todolistId: string, id: string) {
        dispatchTasks(removeTaskAC(todolistId, id))
    }

    function addTask(todolistId: string, title: string) {
        dispatchTasks(addTaskAC(todolistId, title))
    }

    function changeTaskStatus(todolistId: string, taskId: string, isDone: boolean) {
        dispatchTasks(changeTaskStatusAC(todolistId, taskId, isDone))
    }


    function toggleEditMode(taskId: string, editMode: boolean, todolistId: string) {
        const task = tasks[todolistId].find((t) => t.id === taskId);
        if (task) {
            task.editMode = editMode;
        }
        //setTasks({ ...tasks });
    }

    return (
        <>
            <HideAppBar/>
            <Container maxWidth="xl">
                <Grid container spacing={3}>
                    <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
                        <h1 className={style.header_title}></h1>
                        <AddItemForm
                            addItem={addTodolist}
                            textMessage="Todolist created successfully!"
                        />
                    </Grid>
                    {todolists.map((tl) => {
                        let tasksForTodolist = tasks[tl.id];
                        if (tl.filter === FilterValuesType.completed) {
                            tasksForTodolist = tasksForTodolist.filter((t) => t.isDone);
                        }
                        if (tl.filter === FilterValuesType.active) {
                            tasksForTodolist = tasksForTodolist.filter((t) => !t.isDone);
                        }
                        return (
                            <Grid item xs={12} md={6}>
                                <Paper
                                    elevation={3}
                                    variant="outlined"
                                    style={{ padding: "10px" }}
                                >
                                    <Todolist
                                        id={tl.id}
                                        key={tl.id}
                                        title={tl.title}
                                        tasks={tasksForTodolist}
                                        addTask={addTask}
                                        changeTaskStatus={changeTaskStatus}
                                        changeFilter={changeTodolistFilter}
                                        filter={tl.filter}
                                        changeTitleTask={changeTaskTitle}
                                        removeTask={removeTask}
                                        changeTitleTodolist={changeTodolistTitle}
                                        removeTodolist={removeTodolist}
                                        toggleEditMode={toggleEditMode}
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
