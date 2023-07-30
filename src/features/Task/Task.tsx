import React, {ChangeEvent, useCallback, useState} from "react";
import style from "./Task.module.scss";
import {Checkbox, IconButton, Tooltip} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDispatch} from "react-redux";
import {TaskStatus} from "../../api/todolist-api";
import {EditableSpan} from "../../components/EditableSpan/EditableSpan"
import {removeTaskAsync, TaskDomainType, toggleTaskEditMode, updateTaskAsync} from "./tasks-reducer";
type TaskPropsType = {
    keyForLabel: string
    task: TaskDomainType
    todolistId: string
}

export const Task = React.memo(({task, todolistId, keyForLabel}: TaskPropsType) => {
    //console.log('render task')

    const dispatch = useDispatch<any>()

    const [newTitle, setNewTitle] = useState("");
    const removeTask = useCallback(() => dispatch(removeTaskAsync(todolistId, task.id)), [dispatch, todolistId, task.id])

    const onChangeTaskStatus = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateTaskAsync(todolistId, task.id, {status: event.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New}))
    }, [dispatch, todolistId, task.id])

    const activateEditMode = useCallback(() => {
        dispatch(toggleTaskEditMode(todolistId, task.id, true))
        setNewTitle(task.title);
    }, [dispatch, todolistId, task.id, task.title, setNewTitle]);

    const deactivateEditMode = useCallback(() => {
        dispatch(toggleTaskEditMode(todolistId, task.id, false))
        dispatch(updateTaskAsync(todolistId, task.id, {title: newTitle}))
    }, [dispatch, todolistId, task.id, newTitle]);

    return (
        <li key={task.id} className={`${style.task}`}>
            <Tooltip title="completed">
                <Checkbox
                    color="primary"
                    size="medium"
                    id={keyForLabel}
                    checked={task.status === TaskStatus.Completed}
                    onChange={onChangeTaskStatus}
                />
            </Tooltip>
            <label
                htmlFor={keyForLabel}
                className={`${task.status === TaskStatus.Completed ? style.task_completed : ""}`}>
                <EditableSpan
                    title={task.title}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    toggleEditMode={task.editMode}
                    activateEditMode={activateEditMode}
                    deactivateEditMode={deactivateEditMode}
                />
            </label>
            <div className={style.button_container}>
                <Tooltip title="Edit">
                    <IconButton
                        onClick={activateEditMode}
                        color="primary"
                        size="small">
                        <EditIcon/>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                    <IconButton
                        onClick={removeTask}
                        size="small">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        </li>
    );
})