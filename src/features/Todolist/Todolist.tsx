import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {v1} from "uuid";
import {Button, ButtonGroup, Tooltip, Typography} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ReceiptIcon from "@material-ui/icons/Receipt";
import BallotIcon from "@material-ui/icons/Ballot";
import IconButton from "@material-ui/core/IconButton";
import {Task, taskActions} from "../Task";
import {AddItemForm, EditableTitleTodolist} from "../../components";
import {TaskStatus, TaskType} from "../../api/todolist-api";
import {useAppDispatch, useDispatchedActions} from "../../hooks/useAppDispatch";
import {enums} from "../../enums";
import {todolistActions, todolistSelectors} from "./index";
import {useStyles} from "./styles";

type TodolistPropsType = {
    todolistId: string;
    title: string;
    filter: enums.FilterValues;
    entityStatus: enums.StatusRequest;
};

export const Todolist = React.memo(({todolistId, title, filter, entityStatus}: TodolistPropsType) => {

    const dispatch = useAppDispatch()

    const {removeTodolistAsync, changeTodolistFilter} = useDispatchedActions(todolistActions)
    const {fetchTasksAsync, createTaskAsync} = useDispatchedActions(taskActions)

    let tasksForTodolist = useSelector(todolistSelectors.tasksForTodolist(todolistId));

    const classes = useStyles();

    useEffect(() => {
        fetchTasksAsync(todolistId)
    }, [fetchTasksAsync, todolistId])

    const removeTodolistHandler = useCallback(() => {
        removeTodolistAsync(todolistId)
    }, [removeTodolistAsync, todolistId])



    const updateTitleTodolistHandler = useCallback(async (title: string) => {
        // валидация при редактировании title todolist
        const resultAction = await dispatch(todolistActions.updateTodolistTitleAsync({todolistId, title}))
        if (todolistActions.updateTodolistTitleAsync.rejected.match(resultAction)
            && resultAction.payload?.errors.length) {
            // прокидываем текст ошибки дальше, в EditableTitleTodolist
            throw new Error(resultAction.payload.errors[0])
        }
    }, [todolistId, dispatch])

    const createTasksHandler = useCallback(async (title: string) => {
        // валидация при создании task, не зануляет input
        const resultAction = await dispatch(taskActions.createTaskAsync({todolistId, title}))
        if(taskActions.createTaskAsync.rejected.match(resultAction) && resultAction.payload?.errors.length){
            // прокидываем текст ошибки дальше, в EditableTitleTodolist
            throw new Error(resultAction.payload.errors[0])
        }
        createTaskAsync({todolistId, title})
    }, [createTaskAsync, todolistId, dispatch])

    const onClickFilterButtonHandler = useCallback((filterValues: enums.FilterValues) => changeTodolistFilter({
        todolistId,
        filterValue: filterValues
    }), [changeTodolistFilter, todolistId])

    const renderFilterButton = (filterValues: enums.FilterValues,
                                startIcon: React.ReactNode,
                                text: string) => {
        return (
            <Button
                color={filter === filterValues ? "secondary" : "default"}
                startIcon={startIcon}
                onClick={() => {
                    onClickFilterButtonHandler(filterValues)
                }}>
                <Typography noWrap>
                    {text}
                </Typography>
            </Button>
        )
    }

    if (filter === enums.FilterValues.completed) {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatus.Completed)
    }
    if (filter === enums.FilterValues.active) {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatus.New);
    }

    return (
        <div className={classes.container}>
            <div className={classes.header}>
                <Typography variant="h3" color="primary" gutterBottom className={classes.title}>
                    <EditableTitleTodolist
                        title={title}
                        entityStatus={entityStatus}
                        onClick={updateTitleTodolistHandler}
                        key={todolistId}/>
                </Typography>
                <Tooltip title="Delete To Do List"
                         placement={'top'}>
                    <IconButton
                        disabled={entityStatus === enums.StatusRequest.loading}
                        aria-label={'delete'}
                        onClick={removeTodolistHandler}>
                        <DeleteIcon/>
                    </IconButton>
                </Tooltip>
            </div>
            <div>
                <AddItemForm
                    addItem={createTasksHandler}
                    labelMessage="Add a new task..."/>
            </div>
            <ButtonGroup variant="text" fullWidth>
                {renderFilterButton(enums.FilterValues.all, <ReceiptIcon/>, 'all')}
                {renderFilterButton(enums.FilterValues.active, <BallotIcon/>, 'active')}
                {renderFilterButton(enums.FilterValues.completed, <AssignmentTurnedInIcon/>, 'completed')}
            </ButtonGroup>
            <ul>
                {tasksForTodolist.map((task: TaskType) => {
                    const keyForLabel = v1();
                    return (
                        <Task
                            key={task.id}
                            task={task}
                            todolistId={todolistId}
                            keyForLabel={keyForLabel}
                        />);
                })}
            </ul>
        </div>
    );
});
