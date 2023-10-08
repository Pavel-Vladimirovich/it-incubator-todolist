import React, {ChangeEvent, useCallback, useState} from "react";
import style from "./Task.module.scss";
import {Checkbox, IconButton, Tooltip} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {TaskStatus, TaskType} from "../../api/todolist-api";
import {EditableTextTask} from "../../components/";
import {useAppDispatch, useDispatchedActions} from "../../hooks/useAppDispatch";
import {taskActions} from "./index";

type TaskPropsType = {
    keyForLabel: string
    
    task: TaskType
    todolistId: string
}

export const Task = React.memo(({task, todolistId, keyForLabel}: TaskPropsType) => {
    const dispatch = useAppDispatch()
    const {updateTaskAsync, removeTaskAsync} = useDispatchedActions(taskActions)

    const [newTitle, setNewTitle] = useState<string>("");
    const [editMode, toggleEditMode] = useState<boolean>(false);
    const [messageError, setMessageError] = useState<string | null>(null)

    const removeTask = useCallback(() => {
        removeTaskAsync({todolistId, taskId: task.id})
    }, [removeTaskAsync, todolistId, task.id])

    const onChangeTaskStatus = useCallback(((event: ChangeEvent<HTMLInputElement>) => {
        updateTaskAsync({
            todolistId,
            taskId: task.id,
            domainModel: {status: event.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New}
        })
    }),[updateTaskAsync, todolistId, task.id])

    const activateEditMode = useCallback(() => {
        toggleEditMode(true)
        setNewTitle(task.title)
    }, [task.title]);

    const deactivateEditMode = useCallback(async () => {
        // валидация при редактировании task
        const resultAction = await dispatch(taskActions.updateTaskAsync({todolistId, taskId: task.id, domainModel: {title: newTitle}}))
        if(taskActions.updateTaskAsync.rejected.match(resultAction) && resultAction.payload?.errors.length){
            setMessageError(resultAction.payload?.errors[0])
        }else {
            setMessageError(null)
            toggleEditMode(false)
        }
    }, [todolistId, task.id, newTitle, dispatch]);

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
            <div className={style.task_body}>
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
                {messageError && <span className={style.error_message}>{messageError}</span>}
            </div>
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
                        color="secondary"
                        disabled={task.status === TaskStatus.InProgress}
                    >
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </div>
        </li>
    );
})