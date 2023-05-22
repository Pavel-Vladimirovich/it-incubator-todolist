import React, {ChangeEvent} from "react";
import style from "../Todolist/Todolist.module.scss";
import {Checkbox, IconButton, Tooltip} from "@material-ui/core";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {TaskType} from "../Todolist/Todolist";

type PropsTaskType = {
    keyForLabel: string
    onChangeTaskStatus: (value: boolean)=> void
    newTitle: string
    setNewTitle: (value: string)=> void
    activateEditMode: ()=> void
    deactivateEditMode: ()=> void
    removeTask: ()=> void
    task: TaskType
}

export const Task = React.memo(({task, keyForLabel, onChangeTaskStatus, newTitle, setNewTitle, removeTask, activateEditMode, deactivateEditMode}: PropsTaskType) => {
    const onChangeTaskStatusHandler = (event: ChangeEvent<HTMLInputElement>) =>{
        onChangeTaskStatus(event.currentTarget.checked)
    }
    return (
        <li key={task.id} className={`${style.task_item}`}>
            <Tooltip title="completed">
                <Checkbox
                    color="primary"
                    size="medium"
                    id={keyForLabel}
                    checked={task.isDone}
                    onChange={onChangeTaskStatusHandler}
                />
            </Tooltip>
            <label
                htmlFor={keyForLabel}
                className={`${task.isDone ? style.task_isDone : ""} `}>
                <EditableSpan
                    title={task.title}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    toggleEditMode={task.editMode}
                    activateEditMode={activateEditMode}
                    deactivateActivateEditMode={deactivateEditMode}
                />
            </label>
            <div className={style.item_btn_container}>
                <Tooltip title="Edit">
                    <IconButton
                        onClick={activateEditMode}
                        color="primary"
                        size="small">
                        <EditIcon />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        onClick={removeTask}
                        color="secondary"
                        size="small">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </li>
    );})