import React, { useState } from 'react';
// import './App.css';
import style from './App.module.scss';
import Todolist from './Todolist';




//  function Counter(){
//     let arr = useState(5)
//     let data = arr[0];
//     let setData = arr[1]

//     return <div onClick={() => {setData(data + 1)}}>{data}</div>
// }


function App() {

    let [tasks, setTasks] = useState([
        { id: 1, title: "HTML&CSS", isDone: true },
        { id: 2, title: "JS", isDone: true },
        { id: 3, title: "ReactJS", isDone: false },
    ])

    let[filter, setFilter] = useState('all')

    function removeTask(id: number) {
        let filteredTask = tasks.filter(t => t.id !== id)
        setTasks(filteredTask)
        console.log(filteredTask);
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
                tasks={taskForTodolist}
                removeTask={removeTask}
                filterForTask={filterForTask}/>
        </div>
    )
}

export default App;