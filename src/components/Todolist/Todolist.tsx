import React, {ChangeEvent, useState} from "react";
import style from "./Todolist.module.scss";
import {FilterValuesType} from "../../App";
import {v1} from "uuid";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import AddItemForm from "../AddItemForm/AddItemForm";
import {Button, Checkbox, Grid, IconButton, Paper, Tooltip} from "@material-ui/core";
import DeleteIcon from '@material-ui/icons/Delete';
import AssignmentTurnedInIcon from '@material-ui/icons/AssignmentTurnedIn';
import ReceiptIcon from '@material-ui/icons/Receipt';
import BallotIcon from '@material-ui/icons/Ballot';
import BackspaceIcon from '@material-ui/icons/Backspace';
import EditIcon from "@material-ui/icons/Edit";


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
    changeTitleTask: (title: string, id: string, todolistId: string) => void;
    changeTitleTodolist: (title: string, todolistId: string) => void;
};

export const Todolist = (props: PropsType) => {
    const addTasksHandler = (title: string) => {
        props.addTask(title.trim(), props.id);
    };
    const changeTitleTodolistHandler = (title: string) => {
        props.changeTitleTodolist(title, props.id);
    };
    const removeTodolistHandler = () => {
        props.removeTodolist(props.id);
    };
    const onAllClickHandler = () => {
        props.changeFilter(FilterValuesType.all, props.id);
    };
    const onActiveClickHandler = () => {
        props.changeFilter(FilterValuesType.active, props.id);
    };
    const onCompletedClickHandler = () => {
        props.changeFilter(FilterValuesType.completed, props.id);
    };
    //установить значение setValueEditMode
    const [valueEditMode, setValueEditMode] = useState<boolean>()
    return (


        <div className={style.todolist}>
            <div className={style.todolist_header}>
                <h3 className={style.header_title}>
                    <EditableSpan
                        title={props.title}
                        onChangeTitle={changeTitleTodolistHandler}
                    />
                </h3>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<DeleteIcon/>}
                    className={`${style.btn} ${style.btn_header}`}
                    onClick={removeTodolistHandler}>
                    DELETE
                </Button>
            </div>
            <div className={style.todolist_input}>
                <AddItemForm
                    addItem={addTasksHandler}
                />
            </div>
            <div className={style.todolist_filter_btn}>
                <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={12} sm={4}>
                        <Button
                            style={{width: "100%", overflow: "hidden"}}
                            startIcon={<ReceiptIcon/>}
                            variant="contained"
                            color={props.filter === FilterValuesType.all ? "primary" : "default"}
                            className={`${style.btn} ${style.btn_filter}`}
                            onClick={onAllClickHandler}>
                            All
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            style={{width: "100%"}}
                            startIcon={<BallotIcon/>}
                            variant="contained"
                            color={props.filter === FilterValuesType.active ? "primary" : "default"}
                            className={`${style.btn} ${style.btn_filter}`}
                            onClick={onActiveClickHandler}>
                            Active
                        </Button>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Button
                            style={{width: "100%"}}
                            color={props.filter === FilterValuesType.completed ? "primary" : "default"}
                            startIcon={<AssignmentTurnedInIcon/>}
                            variant="contained"
                            className={`${style.btn} ${style.btn_filter}`}
                            onClick={onCompletedClickHandler}>
                            Completed
                        </Button>
                    </Grid>
                </Grid>
            </div>
            <ul className={style.todolist_tasks}>
                {props.tasks.map((t) => {
                    const onClickHandler = () => props.removeTask(t.id, props.id);
                    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
                        props.changeTaskStatus(t.id, event.currentTarget.checked, props.id);
                    };
                    const changeTitleTaskHandler = (title: string) => {
                        props.changeTitleTask(title, t.id, props.id);
                    };
                    const keyForLabel = v1();
                    return (
                        <li key={t.id} className={`${style.task_item}`}>
                            <Tooltip title="completed">
                                <Checkbox
                                    color="primary"
                                    size="small"
                                    className={style.input_checkbox}
                                    id={keyForLabel}
                                    checked={t.isDone}
                                    onChange={onChangeHandler}
                                />
                            </Tooltip>
                            <label
                                htmlFor={keyForLabel}
                                className={`${t.isDone ? style.task_isDone : ""} `}>
                                <EditableSpan
                                    title={t.title}
                                    onChangeTitle={changeTitleTaskHandler}
                                    toggleEditMode={valueEditMode}
                                />
                            </label>
                            <Tooltip title="Edit">
                                <IconButton onClick={() => {setValueEditMode(true)}}
                                            color="primary"
                                            size="small">
                                    <EditIcon color="primary" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Delete">
                                <IconButton aria-label="delete"
                                            size="small"
                                            onClick={onClickHandler}>
                                    <DeleteIcon color="primary"/>
                                </IconButton>
                            </Tooltip>

                        </li>
                    );
                })}
            </ul>
        </div>

    );
};
