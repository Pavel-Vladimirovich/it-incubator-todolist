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
    // let [tasks, setTasks] = useState<Array<TaskType>>([
    //     { id: v1(), title: "HTML&CSS", isDone: false },
    //     { id: v1(), title: "JS", isDone: false },
    //     { id: v1(), title: "ReactJS", isDone: false },
    //     { id: v1(), title: "VueJS", isDone: false },
    //     { id: v1(), title: "TypeScript", isDone: false }
    // ])

    const todolistId1 = v1()
    const todolistId2 = v1()

    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {
            id: todolistId1,
            title: 'What are we studying',
            filter: 'all'
        },
        {
            id: todolistId2,
            title: 'What are we buying',
            filter: 'all'
        },
    ])

    let [tasksObj, setTasks] = useState({
        [todolistId1]: [
            { id: v1(), title: 'HTML & CSS', isDone: false },
            { id: v1(), title: 'JavaScript', isDone: false },
            { id: v1(), title: 'React', isDone: false },
        ],
        [todolistId2]: [
            { id: v1(), title: 'Bread', isDone: false },
            { id: v1(), title: 'Milk', isDone: false },
            { id: v1(), title: 'Meet', isDone: false },
            { id: v1(), title: 'Fish', isDone: false },
        ]
    })

    function changeFilter(value: FilterValuesType, todolistId: string) {
        let todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists]);
        }

    }

    function removeTask(id: string, todolistId: string) {
        let todolistTask = tasksObj[todolistId]
        let filteredTask = todolistTask.filter(t => t.id !== id);
        tasksObj[todolistId] = filteredTask
        setTasks({ ...tasksObj });
    }

    function addTask(title: string, todolistId: string) {
        let task = { id: v1(), title: title, isDone: false }
        let todolistTasks = tasksObj[todolistId]
        tasksObj[todolistId] = [task, ...todolistTasks];
        setTasks({ ...tasksObj });

    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        let todolistTask = tasksObj[todolistId]
        let task = todolistTask.find(t => t.id === taskId);
        if (task) {
            task.isDone = isDone;
        }
        setTasks({ ...tasksObj });
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
                let tasksForTodolist = tasksObj[tl.id];

                if (tl.filter === "completed") {
                    tasksForTodolist = tasksForTodolist.filter(t => t.isDone === true);
                }
                if (tl.filter === "active") {
                    tasksForTodolist = tasksForTodolist.filter(t => t.isDone === false);
                }
                return (
                    <Todolist
                        id={tl.id}
                        key={tl.id}
                        title={tl.title}
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

