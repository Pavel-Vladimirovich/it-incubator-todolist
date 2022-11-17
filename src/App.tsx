import React, { useState } from 'react';
import './App.css';
import './App.scss';
import Todolist from './Todolist';




//  function Counter(){
//     let arr = useState(5)
//     let data = arr[0];
//     let setData = arr[1]
   
//     return <div onClick={() => {setData(data + 1)}}>{data}</div>
// }


function App() {
    let initTasks = [
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

        let arr = useState(initTasks)
        let tasks = arr[0];
        let setTasks = arr[1];
        console.log(tasks)

    function removeTask(id: number) {
        let filteredTask = tasks.filter(t => t.id !== id)
        setTasks(filteredTask)
        console.log(filteredTask);
    }
    

    return (
        <div className='App'>
            <Todolist 
            title="What to learn" 
            tasks={tasks} 
            removeTask={removeTask}/>
            <Todolist 
            title="How do you feel ?" 
            tasks={tasks2} 
            removeTask={removeTask}/>
        </div>
    )
}

export default App;