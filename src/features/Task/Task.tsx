import React, {ChangeEvent, useCallback, useState} from "react";
import style from "./Task.module.scss";
import {Checkbox, IconButton, Tooltip} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {useDispatch} from "react-redux";
import {TaskStatus, TaskType} from "../../api/todolist-api";
import {removeTaskAsync, updateTaskAsync} from "./tasks-reducer";
import { EditableTextTask } from "../../components/EditableTextTask";
type TaskPropsType = {
    keyForLabel: string
    task: TaskType
    todolistId: string
}

export const Task = React.memo(({task, todolistId, keyForLabel}: TaskPropsType) => {
    // console.log('render task')
    const dispatch = useDispatch<any>()
    const [newTitle, setNewTitle] = useState<string>("");
    const [editMode, setEditMode] = useState<boolean>(false);
    const removeTask = useCallback(() => {dispatch(removeTaskAsync(todolistId, task.id))}, [dispatch, todolistId, task.id])

    const onChangeTaskStatus = useCallback((event: ChangeEvent<HTMLInputElement>) => {
        dispatch(updateTaskAsync(todolistId, task.id, {status: event.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New}))
    }, [dispatch, todolistId, task.id])

    const activateEditMode = useCallback(() => {
        setEditMode(true)
        setNewTitle(task.title);
    }, [task.title]);

    const deactivateEditMode = useCallback(() => {
        setEditMode(false)
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
                className={`${task.status === TaskStatus.Completed && style.task_completed}`}>
                <EditableTextTask
                    title={task.title}
                    newTitle={newTitle}
                    setNewTitle={setNewTitle}
                    toggleEditMode={editMode}
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
                        size="small"
                        color="secondary">
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        </li>
    );
})