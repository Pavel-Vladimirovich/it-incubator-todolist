import React, { useState } from 'react';
import style from './App.module.scss';
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
        { id: 4, title: "ReactJS", isDone: false }
    ]
    const tasks2 = [
        { id: 1, title: "Im not happy", isDone: true },
        { id: 2, title: "because", isDone: true },
        { id: 3, title: "I dont have good salary", isDone: false },
    ]


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
    
    let taskForTodolist = tasks

    function filterForTask(item: string){
        setFilter(item)
    }

    if(filter === "completed"){
        taskForTodolist = taskForTodolist.filter(t => t.isDone === true)

    }
    if(filter === "active"){
        taskForTodolist = taskForTodolist.filter(t => t.isDone === false)
    }
   

    return (
        <div className={style.App}>
            <Todolist
                title="What to learn"
                tasks={tasksForTodolist}
                removeTask={removeTask}
                changeFilter={changeFilter} />
        </div>
    )
}

export default App;