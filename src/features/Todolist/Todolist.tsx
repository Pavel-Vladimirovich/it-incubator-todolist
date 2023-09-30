import React, {useCallback, useEffect} from "react";
import {useSelector} from "react-redux";
import {v1} from "uuid";
import {Button, ButtonGroup, Tooltip, Typography} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ReceiptIcon from "@material-ui/icons/Receipt";
import BallotIcon from "@material-ui/icons/Ballot";
import IconButton from "@material-ui/core/IconButton";
import {Task} from "../Task/Task";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TaskStatus, TaskType} from "../../api/todolist-api";
import {EditableTitleTodolist} from "../../components/EditableTitleTodolist";
import {useDispatchedActions} from "../../hooks/useAppDispatch";
import {enums} from "../../enums";
import {actionsTask} from "../Task";
import {todolistActions, todolistSelectors} from "./index";
import {useStyles} from "./styles";

type TodolistPropsType = {
    todolistId: string;
    title: string;
    filter: enums.FilterValues;
    entityStatus: enums.StatusRequest;
};

export const Todolist = React.memo(({todolistId, title, filter, entityStatus}: TodolistPropsType) => {

    const {updateTodolistTitleAsync, removeTodolistAsync, changeTodolistFilter} = useDispatchedActions(todolistActions)

    const {fetchTasksAsync, createTaskAsync} = useDispatchedActions(actionsTask)

    let tasksForTodolist = useSelector(todolistSelectors.tasksForTodolist(todolistId));

    const classes = useStyles();

    useEffect(() => {
        fetchTasksAsync(todolistId)
    }, [fetchTasksAsync, todolistId])

    const removeTodolistHandler = () => {
        removeTodolistAsync(todolistId)
    };
    const updateTitleTodolistHandler = (title: string) => {
        updateTodolistTitleAsync({todolistId, title})
    };
    const createTasksHandler = useCallback((title: string) => { // !!!???
        createTaskAsync({todolistId, title: title.trim()})
    }, [createTaskAsync, todolistId]);

    const onAllClickHandler = useCallback(() => changeTodolistFilter({
        todolistId,
        filterValue: enums.FilterValues.all
    }), [changeTodolistFilter, todolistId]);
    const onActiveClickHandler = useCallback(() => changeTodolistFilter({
        todolistId,
        filterValue: enums.FilterValues.active
    }), [changeTodolistFilter,todolistId]);
    const onCompletedClickHandler = useCallback(() => changeTodolistFilter({
        todolistId,
        filterValue: enums.FilterValues.completed
    }), [changeTodolistFilter,todolistId]);

    if (filter === enums.FilterValues.completed) {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatus.Completed);
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
                        onClisk={updateTitleTodolistHandler}
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
                    textMessage="Task created successfully!"
                    labelMessage="Add a new task..."/>
            </div>
            <ButtonGroup variant="text" fullWidth>
                <Button
                    color={filter === enums.FilterValues.all ? "secondary" : "default"}
                    startIcon={<ReceiptIcon/>}
                    onClick={onAllClickHandler}>
                    <Typography noWrap>
                        All
                    </Typography>
                </Button>
                <Button
                    color={filter === enums.FilterValues.active ? "secondary" : "default"}
                    startIcon={<BallotIcon/>}
                    onClick={onActiveClickHandler}>
                    <Typography noWrap>
                        Active
                    </Typography>
                </Button>
                <Button
                    color={filter === enums.FilterValues.completed ? "secondary" : "default"}
                    startIcon={<AssignmentTurnedInIcon/>}
                    onClick={onCompletedClickHandler}>
                    <Typography noWrap>
                        Completed
                    </Typography>
                </Button>
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
