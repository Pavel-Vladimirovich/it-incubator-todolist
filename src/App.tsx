import React, {useState} from "react";
import style from "./App.module.scss";
import {v1} from 'uuid';
import {TaskType, Todolist} from "./components/Todolist/Todolist";
import AddItemForm from "./components/AddItemForm/AddItemForm";
import {Grid, Paper, TextField, Typography} from "@material-ui/core";

export enum FilterValuesType {
    all = "all",
    completed = "completed",
    active = "active",
}

type TodolistType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};
type TasksObjType = {
    [key: string]: Array<TaskType>;
};

function App() {
    const todolistId1 = v1();
    const todolistId2 = v1();

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {
            id: todolistId1,
            title: "What to learn",
            filter: FilterValuesType.all,
        },
        {
            id: todolistId2,
            title: 'What to buy',
            filter: FilterValuesType.all
        }
    ]);

    let [tasksObj, setTasks] = useState<TasksObjType>({
        [todolistId1]: [
            {
                id: v1(),
                title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
                isDone: false
            },
            {
                id: v1(),
                title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
                isDone: false
            },
            {
                id: v1(),
                title: "React, Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
                isDone: false
            },
            {
                id: v1(),
                title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo ipsa, laborum minus modi non nulla omnis perferendis possimus quam quasi, quidem quod rem reprehenderit repudiandae saepe tenetur. At distinctio eum laudantium, natus perspiciatis quam quod?",
                isDone: false,
            },
        ],
        [todolistId2]: [
            {id: v1(), title: 'Bread', isDone: false},
            {id: v1(), title: 'Milk', isDone: false},
            {id: v1(), title: 'Meet', isDone: false},
            {id: v1(), title: 'Fish', isDone: false},
        ]
    });

    function changeFilter(value: FilterValuesType, todolistId: string) {
        const todolist = todolists.find((tl) => tl.id === todolistId);
        if (todolist) {
            todolist.filter = value;
            setTodolists([...todolists]);
        }
    }

    function changeTitleTodolist(title: string, id: string) {
        const todolist = todolists.find((td) => td.id === id);
        if (todolist) {
            todolist.title = title;
            setTodolists([...todolists]);
        }
    }

    function changeTitleTask(title: string, taskId: string, todolistId: string) {
        const task = tasksObj[todolistId].find((t) => t.id === taskId);
        if (task) task.title = title;
        setTasks({...tasksObj});
    }

    function removeTask(id: string, todolistId: string) {
        tasksObj[todolistId] = tasksObj[todolistId].filter((t) => t.id !== id);
        setTasks({...tasksObj});
    }

    function addTask(title: string, todolistId: string) {
        const task = {id: v1(), title: title, isDone: false};
        tasksObj[todolistId] = [task, ...tasksObj[todolistId]];
        setTasks({...tasksObj});
    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        const task = tasksObj[todolistId].find((t) => t.id === taskId);
        if (task) {
            task.isDone = isDone;
        }
        setTasks({...tasksObj});
    }

    function addTodolist(title: string) {
        const todolist: TodolistType = {
            id: v1(),
            title: title,
            filter: FilterValuesType.all,
        };
        setTodolists([...todolists, todolist]);
        setTasks({...tasksObj, [todolist.id]: []});
    }

    function removeTodolist(id: string) {
        todolists = todolists.filter((tl) => tl.id !== id);
        delete tasksObj[id];
        setTodolists([...todolists]);
    }

    return (
        <Grid container
              spacing={3}>
            <Grid item xs={12} style={{textAlign: "center"}}>
                <h1 className={style.header_title}>Todolist</h1>
                <AddItemForm
                    addItem={addTodolist}
                />
            </Grid>
            {todolists.map((tl) => {
                let tasksForTodolist = tasksObj[tl.id];
                if (tl.filter === FilterValuesType.completed) {
                    tasksForTodolist = tasksForTodolist.filter(
                        (t) => t.isDone
                    );
                }
                if (tl.filter === FilterValuesType.active) {
                    tasksForTodolist = tasksForTodolist.filter(
                        (t) => !t.isDone
                    );
                }
                return (
                    <Grid item xs={12} md={6}>
                        <Paper elevation={3} variant="outlined"
                               style={{padding: "10px"}}>
                            <Todolist
                                id={tl.id}
                                key={tl.id}
                                title={tl.title}
                                tasks={tasksForTodolist}
                                addTask={addTask}
                                changeTaskStatus={changeStatus}
                                changeFilter={changeFilter}
                                filter={tl.filter}
                                changeTitleTask={changeTitleTask}
                                removeTask={removeTask}
                                changeTitleTodolist={changeTitleTodolist}
                                removeTodolist={removeTodolist}
                            />
                        </Paper>
                    </Grid>
                );
            })}


        </Grid>

    );
}

export default App;
