
import { title } from 'process';
import React, { useState } from 'react';
import style from './App.module.scss';
import { Counter } from './components/Counter';
import { FullInput } from './components/FullInput/FullInput';
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
        function addTitleMessge (title: string) {
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
                <FullInput addTitleMessge = {addTitleMessge}/>
                {message.map((el, index) => {
                    return (
                        <div key={index}>{el.message}</div>
                    )
                })}
            </div>
            <Counter/>
            {/* =========================задание по инпутам============ */}
        </div>
    )
}

export default App;

