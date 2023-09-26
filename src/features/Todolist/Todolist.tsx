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
import {AppRootState} from "../../app/store";
import {AddItemForm} from "../../components/AddItemForm/AddItemForm";
import {TaskStatus, TaskType} from "../../api/todolist-api";
import {updateTodolistTitleAsync} from "./todolist-reducer";
import {createTaskAsync, fetchTasksAsync,} from "../Task/tasks-reducer";
import {EditableTitleTodolist} from "../../components/EditableTitleTodolist";
import {makeStyles} from '@material-ui/core/styles';
import {useAppDispatch} from "../../hooks/useAppDispatch";
import {StatusRequest} from "../../enums/statusRequest";
import {FilterValues} from "../../enums/filterValues";

const useStyles = makeStyles({
    container: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto auto auto auto",
        gap: "25px",
        padding: "10px",
    },
    header: {
        display: "flex",
        alignItems: "center",
    },
    title: {
        flex: "1 1 auto",
        textTransform: "uppercase",
        letterSpacing: '.1rem',
        wordBreak: "break-word"
    }
})

type TodolistPropsType = {
    todolistId: string;
    title: string;
    changeFilter: (todolistId: string, filterValue: FilterValues) => void;
    filter: FilterValues;
    entityStatus: StatusRequest;
    removeTodolist: (todolistId: string) => void
};

export const Todolist = React.memo(({todolistId, title, changeFilter, filter, entityStatus, removeTodolist}: TodolistPropsType) => {
    const dispatch = useAppDispatch();
    
    let tasksForTodolist = useSelector<AppRootState, TaskType[]>((state => state.tasks[todolistId]));
   
    const classes = useStyles();

    useEffect(() => {
        dispatch(fetchTasksAsync(todolistId))
    }, [dispatch, todolistId])

    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    };
    const updateTitleTodolistHandler = (title: string) => {
      dispatch(updateTodolistTitleAsync({todolistId, title}))
    };
    const createTasksHandler = useCallback((title: string) => {
        dispatch(createTaskAsync({todolistId, title: title.trim()}))
    }, [dispatch, todolistId]);

    const onAllClickHandler = useCallback(() => changeFilter(todolistId, FilterValues.all), [changeFilter, todolistId]);
    const onActiveClickHandler = useCallback(() => changeFilter(todolistId, FilterValues.active), [changeFilter, todolistId]);
    const onCompletedClickHandler = useCallback(() => changeFilter(todolistId, FilterValues.completed), [changeFilter, todolistId]);

    if (filter === FilterValues.completed) {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatus.Completed);
    }
    if (filter === FilterValues.active) {
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
                        disabled={entityStatus === StatusRequest.loading}
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
                        color={filter === FilterValues.all ? "secondary" : "default"}
                        startIcon={<ReceiptIcon/>}
                        onClick={onAllClickHandler}>
                        <Typography noWrap>
                            All
                        </Typography>
                    </Button>
                    <Button
                        color={filter === FilterValues.active ? "secondary" : "default"}
                        startIcon={<BallotIcon/>}
                        onClick={onActiveClickHandler}>
                        <Typography noWrap>
                            Active
                        </Typography>
                    </Button>
                    <Button
                        color={filter === FilterValues.completed ? "secondary" : "default"}
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
