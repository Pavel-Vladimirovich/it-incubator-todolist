import React, {ChangeEvent, useCallback} from "react";
import style from "../Todolist/Todolist.module.scss";
import {Checkbox, IconButton, Tooltip} from "@material-ui/core";
import {EditableSpan} from "../EditableSpan/EditableSpan";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {TaskType} from "../Todolist/Todolist";
import {changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, toggleTaskEditModeAC} from "../../state/tasks-reducer";
import {useDispatch} from "react-redux";

type PropsTaskType = {
    keyForLabel: string
    newTitle: string
    setNewTitle: (value: string)=> void
    task: TaskType
    todolistId: string
}

export const Task = React.memo(({task, todolistId, keyForLabel, newTitle, setNewTitle}: PropsTaskType) => {
    console.log('render task')
    const dispatch = useDispatch()

    const removeTaskHandler = useCallback(() => dispatch(removeTaskAC(todolistId, task.id)), [dispatch,todolistId,task.id])

    const onChangeTaskStatusHandler = useCallback( (event: ChangeEvent<HTMLInputElement>) =>{
        dispatch(changeTaskStatusAC(todolistId, task.id, event.currentTarget.checked))
    }, [dispatch,todolistId, task.id])

    const activateEditMode = useCallback(() => {
        dispatch(toggleTaskEditModeAC(todolistId, task.id, true))
        setNewTitle(task.title);
    },[dispatch, todolistId, task.id, task.title, setNewTitle]);

    const deactivateEditMode = useCallback(() => {
        dispatch(toggleTaskEditModeAC(todolistId, task.id, false))
        dispatch(changeTaskTitleAC(todolistId, task.id, newTitle))
    }, [dispatch, todolistId, task.id, newTitle]);
    
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
                className={`${task.isDone ? style.task_isDone : ""}`}>
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
                        onClick={removeTaskHandler}
                        color="secondary"
                        size="small">
                        <DeleteIcon />
                    </IconButton>
                </Tooltip>
            </div>
        </li>
    );})