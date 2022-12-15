
import { title } from 'process';
import React, { useState } from 'react';
import style from './App.module.scss';
import { Button } from './components/Button/Button';
// import { Counter } from './components/Counter';
import { FullInput } from './components/FullInput/FullInput';
import { Input } from './components/Input/input';
import state from './components/social';
import Todolist, { TaskType } from './components/Todolist/Todolist';

export type FilterValuesType = "all" | "completed" | "active";

function App() {
    let [tasks, setTasks] = useState<Array<TaskType>>([
        { id: 1, title: "HTML&CSS", isDone: true },
        { id: 2, title: "JS", isDone: true },
        { id: 3, title: "ReactJS", isDone: false },
        { id: 4, title: "VueJS", isDone: false },
        { id: 5, title: "TypeScript", isDone: false }
    ])

    let [filter, setFilter] = useState('all');

    function removeTask(id: number) {
        let filteredTask = tasks.filter(t => t.id !== id);
        setTasks(filteredTask);
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
    // ==========================================================
    let [message, setMessage] = useState([
        { message: '' },
    ])
        function addMessge (title: string) {
            setMessage([{message: title}, ...message]);
        }
    // =================задание по инпутам=======================
    // console.log(state.dialogPage.dialogs[2]);

    return (
        <div className={style.App}>
            <Todolist
                title="What to learn"
                tasks={tasksForTodolist}
                removeTask={removeTask}
                changeFilter={changeFilter} />
            {/*======================================================  */}
            <div className={style.fullInput}>
                {/* <FullInput addTitleMessge = {addMessge}/> */}
                <Input/>
                <Button/>
                {message.map((element, index) => {
                    return (
                        <div key={index}>{element.message}</div>
                    )
                })}
            </div>
            {/* <Counter/> */}
            {/* =========================задание по инпутам============ */}
        </div>
    )
}

export default App;

