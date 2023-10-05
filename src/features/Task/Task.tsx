import React, {ChangeEvent, useCallback, useState} from "react";
import style from "./Task.module.scss";
import {Checkbox, IconButton, Tooltip} from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import {TaskStatus, TaskType} from "../../api/todolist-api";
import {EditableTextTask} from "../../components/";
import {useDispatchedActions} from "../../hooks/useAppDispatch";
import {taskActions} from "./index";
import {enums} from "../../enums";

type TaskPropsType = {
    keyForLabel: string
    
    task: TaskType
    todolistId: string
}

export const Task = React.memo(({task, todolistId, keyForLabel}: TaskPropsType) => {

    const {updateTaskAsync, removeTaskAsync} = useDispatchedActions(taskActions)

    const [newTitle, setNewTitle] = useState<string>("");
    const [editMode, toggleEditMode] = useState<boolean>(false);

    const removeTask = () => (removeTaskAsync({todolistId, taskId: task.id}))

    const onChangeTaskStatus = useCallback(((event: ChangeEvent<HTMLInputElement>) => {
        updateTaskAsync({
            todolistId,
            taskId: task.id,
            domainModel: {status: event.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New}
        })
    }),[updateTaskAsync, todolistId, task.id])

    const activateEditMode = useCallback(() => { //!!!!!!!!!!!!!!!!!!! переписать
        if(!(task.status === enums.TaskStatus.InProgress))
            toggleEditMode(true)
            setNewTitle(task.title)
        if(task.status === enums.TaskStatus.Draft)
            console.log(task.title)
            console.error(newTitle)
            // setNewTitle(task.title)
    }, [task.title, newTitle,task.status ]);

    const deactivateEditMode = useCallback(() => {
        toggleEditMode(false)
        updateTaskAsync({todolistId, taskId: task.id, domainModel: {title: newTitle}})
    }, [updateTaskAsync, todolistId, task.id, newTitle]);

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