import React from 'react';
import './App.css';
import './App.scss';
import Todolist from './Todolist';

function App() {
    const tasks1 = [
        {id: 1, title: "HTML&CSS", isDone: true},
        {id: 2, title: "JS", isDone: true},
        {id: 3, title: "ReactJS", isDone: false},
        {id: 4, title: "ReactJS", isDone: false}
    ]
    const tasks2 = [
        {id: 1, title: "Im not happy", isDone: true},
        {id: 2, title: "because", isDone: true},
        {id: 3, title: "I dont have good salary", isDone: false},
        {id: 4, title: "I dont have good salary", isDone: false},
        {id: 5, title: "I dont have good salary", isDone: false}
    ]
        
    return (
        <div className='App'>
            <Todolist title="What to learn" tasks={tasks1}/>
            <Todolist title="Books" tasks={tasks2}/>
            <Todolist title="Songs" tasks={tasks1}/>
            <Todolist title="I dont understand anything" tasks={tasks2}/>
        </div>
    )
}

export default App;