import React, {useState} from 'react';
import style from './App.module.scss';
import {v1} from 'uuid';
import Todolist, {TaskType} from './components/Todolist/Todolist';


export type FilterValuesType = "all" | "completed" | "active";

type TodolistType = {
    id: string
    title: string
    filter: FilterValuesType
}
type TasksObjType = {
    [key: string]: Array<TaskType>
}

function App() {

    const todolistId1 = v1()
    const todolistId2 = v1()
    const todolistId3 = v1()


    let [todolists, setTodolists] = useState<Array<TodolistType>>([
        {
            id: todolistId1,
            title: 'What to learn',
            filter: 'all'
        },
        {
            id: todolistId2,
            title: 'What to buy',
            filter: 'all'
        },
        {
            id: todolistId3,
            title: 'fo fresh breath',
            filter: 'completed'
        }
    ])

    let [tasksObj, setTasks] = useState<TasksObjType>({
        [todolistId1]: [
            {id: v1(), title: 'HTML & CSS', isDone: false},
            {id: v1(), title: 'JavaScript', isDone: false},
            {id: v1(), title: 'React', isDone: false},
        ],
        [todolistId2]: [
            {id: v1(), title: 'Bread', isDone: false},
            {id: v1(), title: 'Milk', isDone: false},
            {id: v1(), title: 'Meet', isDone: false},
            {id: v1(), title: 'Fish', isDone: false},
        ],
        [todolistId3]: [
            {id: v1(), title: 'Onion', isDone: false},
            {id: v1(), title: 'Garlik', isDone: false},
        ],
    })

    function changeFilter(value: FilterValuesType, todolistId: string) {
        const todolist = todolists.find(tl => tl.id === todolistId)
        if (todolist) {
            todolist.filter = value
            setTodolists([...todolists]);
        }
    }

    function removeTask(id: string, todolistId: string) {
        tasksObj[todolistId] = tasksObj[todolistId].filter(t => t.id !== id);
        setTasks({...tasksObj});
    }

    function addTask(title: string, todolistId: string) {
        const task = {id: v1(), title: title, isDone: false}
        tasksObj[todolistId] = [task, ...tasksObj[todolistId]];
        setTasks({...tasksObj});

    }

    function changeStatus(taskId: string, isDone: boolean, todolistId: string) {
        const task = tasksObj[todolistId].find(t => t.id === taskId);
        if (task) {
            task.isDone = isDone;
        }
        setTasks({...tasksObj});
    }

    function removeTodolist(id: string) {
        todolists = todolists.filter(tl => tl.id !== id)
        delete tasksObj[id]
        setTodolists([...todolists])
    }

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
                        changeTaskStatus={changeStatus}
                        changeFilter={changeFilter}
                        filter={tl.filter}
                        removeTask={removeTask}
                        removeTodolist={removeTodolist}/>
                )
            })}
        </div>
    )
}

export default App;

