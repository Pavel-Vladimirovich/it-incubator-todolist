import React, { useState } from 'react';
import './App.css';
import './App.scss';
import Todolist, { TaskType } from './Todolist';




//  function Counter(){
//     let arr = useState(5)
//     let data = arr[0];
//     let setData = arr[1]

//     return <div onClick={() => {setData(data + 1)}}>{data}</div>
// }
export type FilterValuesType = "all" | "completed" | "active";

function App() {
    let [tasks, setTasks] = useState<Array<TaskType>>([
        { id: 1, title: "HTML&CSS", isDone: true },
        { id: 2, title: "JS", isDone: true },
        { id: 3, title: "ReactJS", isDone: false },
        { id: 4, title: "ReactJS", isDone: false },
        { id: 5, title: "ReactJS", isDone: false },
        { id: 6, title: "ReactJS", isDone: false },
        { id: 7, title: "ReactJS", isDone: false },
        { id: 8, title: "ReactJS", isDone: false },
        { id: 9, title: "ReactJS", isDone: false },
        { id: 10, title: "ReactJS", isDone: false },
    ]);
    let [filter, setFilter] = useState<FilterValuesType>("all");


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
    


    return (
        <div className='App'>
            <Todolist
                title="What to learn"
                tasks={tasksForTodolist}
                removeTask={removeTask}
                changeFilter={changeFilter} />
        </div>
    )
}

export default App;