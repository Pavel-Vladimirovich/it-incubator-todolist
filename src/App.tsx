import React from 'react';
import './App.css';
import './App.scss';
import Todolist from './Todolist';

function App() {
    let tasks1 = [
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
        tasks1 = tasks1.filter(t => t.id !== id) 
        console.log(tasks1);
    }
    return (
        <div className='App'>
            <Todolist 
            title="What to learn" 
            tasks={tasks1} 
            removeTask={removeTask}/>
            <Todolist 
            title="How do you feel ?" 
            tasks={tasks2} 
            removeTask={removeTask}/>
        </div>
    )
}

export default App;