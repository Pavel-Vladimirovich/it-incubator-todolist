import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import style from './Todolist.module.scss';
import {FilterValuesType} from "../../App";
import {v1} from "uuid";

export type TaskType = {
    id: string,
    title: string,
    isDone: boolean,
}

type PropsType = {
    id: string
    title: string
    tasks: Array<TaskType>
    addTask: (title: string, todolistId: string) => void
    changeFilter: (value: FilterValuesType, todolistId: string) => void
    changeTaskStatus: (taskId: string, isDone: boolean, todolistId: string) => void
    filter: FilterValuesType
    removeTask: (id: string, todolistId: string) => void
    removeTodolist: (id: string) => void
}


function Todolist(props: PropsType) {

    let [title, setTitle] = useState('');
    let [error, setError] = useState<string | null>(null)


    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
    }
    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (event.key === 'Enter') {
            addTasksHandler()
            setTitle('');
        }
    }

    const addTasksHandler = () => {
        if (title.trim() === '') {
            setError('field cannot be empty')
            return
        }
        if (title.length > 10) {
            setError('Task name cannot be more than 10 letters')
            return
        }
        props.addTask(title.trim(), props.id);
        setTitle('');
    }

    function removeTodolistHandler() {
        props.removeTodolist(props.id)
    }

    const onAllClickHandler = () => {
        props.changeFilter('all', props.id);
    }
    const onActiveClickHandler = () => {
        props.changeFilter('active', props.id);
    }
    const onCompletedClickHandler = () => {
        props.changeFilter('completed', props.id);
    }


    return (
        <div className={style.todolist}>
            <div className={style.todolist_header}>
                {error ? <h3 className={style.error_message}>{error}</h3> : <h3>{props.title}</h3>}
                <button className={`${style.btn} ${style.btn_header}`} onClick={removeTodolistHandler}>x</button>
            </div>
            <div className={style.todolist_input}>
                <input value={title} className={`${style.input} ${error ? style.error : ""}`}
                       onChange={onChangeHandler} onKeyDown={onKeyPressHandler}/>
                <button className={`${style.btn} ${style.btn_input}`} onClick={addTasksHandler}>add</button>
            </div>
            <div className={style.todolist_filter}>
                <button className={`${style.btn} ${style.btn_filter} ${props.filter === 'all' ? style.active_filter : ""}`}
                        onClick={onAllClickHandler}>All
                </button>
                <button className={`${style.btn} ${style.btn_filter} ${props.filter === 'active' ? style.active_filter : ""}`}
                        onClick={onActiveClickHandler}>Active
                </button>
                <button className={`${style.btn} ${style.btn_filter} ${props.filter === 'completed' ? style.active_filter : ""}`}
                        onClick={onCompletedClickHandler}>Completed
                </button>
            </div>
            <ul className={style.todolist_tasks}>
                {props.tasks.map(t => {
                    const onClickHandler = () => props.removeTask(t.id, props.id);
                    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, event.currentTarget.checked, props.id)
                    }
                    const keyForLabel = v1()
                    return (
                        <li className={`${style.task_item}`}>
                            <label htmlFor={keyForLabel}>
                                <input id={keyForLabel} type="checkbox" checked={t.isDone} onChange={onChangeHandler}/>
                                <span className={`${t.isDone ? style.task_isDone : ''}`}>{t.title}</span>
                            </label>
                            <button className={`${style.btn} ${style.btn_remove}`} onClick={onClickHandler}>х
                            </button>
                        </li>)
                })}
            </ul>

        </div>
    );
}

export default Todolist;