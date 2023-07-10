import React, {useCallback, useEffect} from "react";
import {useDispatch, useSelector} from "react-redux";
import style from "./Todolist.module.scss"
import {v1} from "uuid";
import {FilterValuesType} from "../../todolist-reducer";
import {createTaskTC, fetchTasksTC, TaskDomainType} from "../../tasks-reducer";
import {AppStateType} from "../../../app/store";
import {AddItemForm} from "../../../components/AddItemForm/AddItemForm";
import {Button, Grid, Tooltip} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ReceiptIcon from "@material-ui/icons/Receipt";
import BallotIcon from "@material-ui/icons/Ballot";
import {Task} from "./Task/Task";
import {TaskStatus} from "../../../api/todolist-api";
import IconButton from "@material-ui/core/IconButton";


type TodolistPropsType = {
    todolistId: string;
    title: string;
    changeFilter: (todolistId: string, filterValue: FilterValuesType) => void;
    filter: FilterValuesType;
    removeTodolist: (todolistId: string) => void
};

export const Todolist = React.memo(({todolistId, title, changeFilter, filter, removeTodolist}: TodolistPropsType) => {
    console.log('render todolist')
    let tasksForTodolist = useSelector<AppStateType, Array<TaskDomainType>>((state => state.tasks[todolistId]));
    const dispatch = useDispatch<any>();

    useEffect(() => {
        dispatch(fetchTasksTC(todolistId))
    }, [])

    const removeTodolistHandler = () => {
        removeTodolist(todolistId)
    };
    // const changeTitleTodolistHandler = (title: string) => {
    //   dispatch(changeTodolistTitleAC(props.id, title))
    // };
    const createTasksHandler = useCallback((title: string) => {
        dispatch(createTaskTC(todolistId, title.trim()))
    }, [dispatch, todolistId]);

    const onAllClickHandler = useCallback(() => changeFilter(todolistId, FilterValuesType.all), [changeFilter, todolistId]);
    const onActiveClickHandler = useCallback(() => changeFilter(todolistId, FilterValuesType.active), [changeFilter, todolistId]);
    const onCompletedClickHandler = useCallback(() => changeFilter(todolistId, FilterValuesType.completed), [changeFilter, todolistId]);

    if (filter === FilterValuesType.completed) {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatus.Completed);
    }
    if (filter === FilterValuesType.active) {
        tasksForTodolist = tasksForTodolist.filter((t) => t.status === TaskStatus.New);
    }

    return (
        <div className={style.todolist}>
            <div className={style.todolist_header}>
                <h3 className={style.header_title}>
                    {title}
                    {/*<EditableSpan*/}
                </h3>
                <Tooltip title="Delete To Do List"
                         placement={'top'}>
                    <IconButton
                        //color={"secondary"}
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
            <Grid container spacing={1}>
                <Grid item xs={12} sm={4}>
                    <Button
                        style={{width: "100%"}}
                        color={filter === FilterValuesType.all ? "primary" : "default"}
                        startIcon={<ReceiptIcon/>}
                        variant="contained"
                        onClick={onAllClickHandler}>
                        All
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button
                        style={{width: "100%"}}
                        color={filter === FilterValuesType.active ? "primary" : "default"}
                        startIcon={<BallotIcon/>}
                        variant="contained"
                        onClick={onActiveClickHandler}>
                        Active
                    </Button>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Button
                        style={{width: "100%"}}
                        color={filter === FilterValuesType.completed ? "primary" : "default"}
                        startIcon={<AssignmentTurnedInIcon/>}
                        variant="contained"
                        onClick={onCompletedClickHandler}>
                        Completed
                    </Button>
                </Grid>
            </Grid>
            <ul>
                {tasksForTodolist.map((task: TaskDomainType) => {
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
