import React, { useState } from 'react';
import style from './App.module.scss';
import { v1 } from 'uuid';
// import { Button } from './components/Button/Button';
// import { Counter } from './components/Counter';
// import { FullInput } from './components/FullInput/FullInput';
// import { Input } from './components/Input/Input';
import { Input2 } from './components/Input/Input2';
import { Button2 } from './components/Button/Button2';
import Todolist, { TaskType } from './components/Todolist/Todolist';


export type FilterValuesType = "all" | "completed" | "active";

type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}

function App() {
    let [tasks, setTasks] = useState<Array<TaskType>>([
        { id: v1(), title: "HTML&CSS", isDone: false },
        { id: v1(), title: "JS", isDone: false },
        { id: v1(), title: "ReactJS", isDone: false },
        { id: v1(), title: "VueJS", isDone: false },
        { id: v1(), title: "TypeScript", isDone: false }
    ])

    let [filter, setFilter] = useState<FilterValuesType>('all');
    // фильтрация тасок

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {
            id: v1(),
            title: 'What are we studying',
            filter: 'all'
        },
        {
            id: v1(),
            title: 'What are we buying',
            filter: 'all'
        },
    ])

    function removeTask(id: string) {
        let filteredTask = tasks.filter(t => t.id !== id);
        setTasks(filteredTask);
    }

    function addTask(title: string) {
        let task = { id: v1(), title: title, isDone: false };
        let newTasks = [task, ...tasks];
        setTasks(newTasks);

    }

    function changeStatus(taskId: string, isDone: boolean) {
        let task = tasks.find(t => t.id === taskId);
        if (task) {
            task.isDone = isDone;
        }
        setTasks([...tasks]);
    }


    function changeFilter(value: FilterValuesType) {
        setFilter(value);
    }

    let tasksForTodolist = tasks;

    if (filter === "completed") {
        tasksForTodolist = tasks.filter(t => t.isDone === true);
    }
    if (filter === "active") {
        tasksForTodolist = tasks.filter(t => t.isDone === false);
    }
    // =================задание по инпутам=======================
    let [message, setMessage] = useState([
        { message: '' },
    ]);

    function sendMessege(title: string) {
        setMessage([{ message: title }, ...message]);
    }

    let [title, setTitle] = useState('')

    function onChangeTitleHandler(title: string) {
        setTitle(title);
    }
    function addMessage() {
        sendMessege(title);
        setTitle('');
    }

    // =================задание по инпутам=======================

    return (
        <div className={style.App}>
            {todolists.map(tl => {
                return (
                    <Todolist
                        title={tl.title}
                        key={tl.id}
                        tasks={tasksForTodolist}
                        addTask={addTask}
                        removeTask={removeTask}
                        changeTaskStatus={changeStatus}
                        changeFilter={changeFilter}
                        filter={tl.filter} />
                )
            })}

            {/*======================================================  */}
            <div>
                <Input2 title={title} setTitle={onChangeTitleHandler} />
                <Button2 name='send text' callback={addMessage} />
                {message.map((el, i) => {
                    return (
                        <div key={i}>{el.message}</div>
                    )
                })}
            </div>
            {/* =========================задание по инпутам============ */}
        </div>
    )
}

export default App;

