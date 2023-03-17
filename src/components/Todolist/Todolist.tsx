import React, {ChangeEvent} from "react";
import style from "./Todolist.module.scss";
import {FilterValuesType} from "../../App";
import {v1} from "uuid";
import {AddItemForm} from "../AddItemForm/AddItemForm";

export type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
};

type PropsType = {
    id: string;
    title: string;
    tasks: Array<TaskType>;
    addTask: (title: string, todolistId: string) => void;
    changeFilter: (value: FilterValuesType, todolistId: string) => void;
    changeTaskStatus: (
        taskId: string,
        isDone: boolean,
        todolistId: string
    ) => void;
    filter: FilterValuesType;
    removeTask: (id: string, todolistId: string) => void;
    removeTodolist: (id: string) => void;
};

function Todolist(props: PropsType) {

    const addTasksHandler = (title: string) => {
        props.addTask(title.trim(), props.id);
    }

    function removeTodolistHandler() {
        props.removeTodolist(props.id);
    }

    const onAllClickHandler = () => {
        props.changeFilter(FilterValuesType.all, props.id);
    };
    const onActiveClickHandler = () => {
        props.changeFilter(FilterValuesType.active, props.id);
    };
    const onCompletedClickHandler = () => {
        props.changeFilter(FilterValuesType.completed, props.id);
    };

    return (
        <div className={style.todolist}>
            <div className={style.todolist_header}>
                <h3>{props.title}</h3>
                <button
                    className={`${style.btn} ${style.btn_header}`}
                    onClick={removeTodolistHandler}>x
                </button>
            </div>
            <div className={style.todolist_input}>
                <AddItemForm addItem={addTasksHandler}/>
            </div>
            <div className={style.todolist_filter}>
                <button
                    className={`${style.btn} ${style.btn_filter} 
                    ${props.filter === FilterValuesType.all ? style.active_filter : ""}`}
                    onClick={onAllClickHandler}>All
                </button>
                <button
                    className={`${style.btn} ${style.btn_filter} ${
                        props.filter === FilterValuesType.active ? style.active_filter : ""
                    }`}
                    onClick={onActiveClickHandler}
                >
                    Active
                </button>
                <button
                    className={`${style.btn} ${style.btn_filter} ${
                        props.filter === FilterValuesType.completed ? style.active_filter : ""
                    }`}
                    onClick={onCompletedClickHandler}
                >
                    Completed
                </button>
            </div>
            <ul className={style.todolist_tasks}>
                {props.tasks.map((t) => {
                    const onClickHandler = () => props.removeTask(t.id, props.id);
                    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, event.currentTarget.checked, props.id);
                    };
                    const keyForLabel = v1();
                    return (
                        <li className={`${style.task_item}`}>
                            <label htmlFor={keyForLabel}>
                                <input
                                    id={keyForLabel}
                                    type="checkbox"
                                    checked={t.isDone}
                                    onChange={onChangeHandler}
                                />
                                <span
                                    className={`${t.isDone ? style.task_isDone : ""}`}>
                                    {t.title}
                                </span>
                            </label>
                            <button
                                className={`${style.btn} ${style.btn_remove}`}
                                onClick={onClickHandler}>x
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );
}

export default Todolist;
