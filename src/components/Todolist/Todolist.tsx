import React, {ChangeEvent, useCallback, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import style from "./Todolist.module.scss";
import { v1 } from "uuid";
import { FilterValuesType} from "../../state/todolist-reducer";
import {addTaskAC, changeTaskStatusAC, changeTaskTitleAC, removeTaskAC, toggleTaskEditModeAC} from "../../state/tasks-reducer";
import {AppStateType} from "../../state/store";
import { EditableSpan } from "../EditableSpan/EditableSpan";
import { AddItemForm } from "../AddItemForm/AddItemForm";
import {Button, Checkbox, Grid, IconButton, Tooltip} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ReceiptIcon from "@material-ui/icons/Receipt";
import BallotIcon from "@material-ui/icons/Ballot";
import EditIcon from "@material-ui/icons/Edit";

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
  editMode: boolean;
};

type TodolistPropsType = {
  id: string;
  title: string;
  changeFilter: (todolistId: string, filterValue: FilterValuesType) => void;
  filter: FilterValuesType;
  removeTodolist: (todolistId: string) => void
};

export const Todolist = React.memo((props: TodolistPropsType) => {
    console.log('render todolist')
  const tasks = useSelector<AppStateType, Array<TaskType>>((state => state.tasks[props.id]));
  const dispatch = useDispatch();
  const [newTitle, setNewTitle] = useState("");

  const removeTodolistHandler = () => {
    props.removeTodolist(props.id)
  };
  // const changeTitleTodolistHandler = (title: string) => {
  //   dispatch(changeTodolistTitleAC(props.id, title))
  // };
  const addTasksHandler = useCallback( (title: string) => {
    dispatch(addTaskAC(props.id, title.trim()))
  },[dispatch,props.id]);

  const onAllClickHandler = useCallback(() => props.changeFilter(props.id, FilterValuesType.all),[props.changeFilter]);// почему-то ругается на зависимости
  const onActiveClickHandler = useCallback(() => props.changeFilter(props.id, FilterValuesType.active),[props.changeFilter]);
  const onCompletedClickHandler = useCallback(() => props.changeFilter(props.id, FilterValuesType.completed),[props.changeFilter]);

  let tasksForTodolist = tasks;
  if (props.filter === FilterValuesType.completed) {
    tasksForTodolist = tasksForTodolist.filter((t) => t.isDone);
  }
  if (props.filter === FilterValuesType.active) {
    tasksForTodolist = tasksForTodolist.filter((t) => !t.isDone);
  }

  return (
    <div className={style.todolist}>
      <div className={style.todolist_header}>
        <h3 className={style.header_title}>
          {props.title}
          {/*<EditableSpan*/}
        </h3>
        <Button
          variant="contained"
          color="secondary"
          startIcon={<DeleteIcon />}
          onClick={removeTodolistHandler}
        >remove</Button>
      </div>
      <div className={style.todolist_input}>
        <AddItemForm
            addItem={addTasksHandler}
            textMessage="Task created successfully!"
            labelMessage="Add a new task..."/>
      </div>
      <div className={style.todolist_filter}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Button
              style={{ width: "100%" }}
              color={props.filter === FilterValuesType.all ? "primary" : "default"}
              startIcon={<ReceiptIcon />}
              variant="contained"
              onClick={onAllClickHandler}>
              All
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              style={{ width: "100%" }}
              color={props.filter === FilterValuesType.active ? "primary" : "default"}
              startIcon={<BallotIcon />}
              variant="contained"
              onClick={onActiveClickHandler}>
              Active
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              style={{width: "100%"}}
              color={props.filter === FilterValuesType.completed ? "primary" : "default"}
              startIcon={<AssignmentTurnedInIcon />}
              variant="contained"
              onClick={onCompletedClickHandler}>
              Completed
            </Button>
          </Grid>
        </Grid>
      </div>
      <ul className={style.todolist_tasks}>
        {tasksForTodolist.map((t) => {

          const activateEditMode = () => {
            dispatch(toggleTaskEditModeAC(props.id, t.id, true))
            setNewTitle(t.title);
          };

          const deactivateEditMode = () => {
            dispatch(toggleTaskEditModeAC(props.id, t.id, false))
            dispatch(changeTaskTitleAC(props.id, t.id, newTitle))
          };

          const removeTask = () => dispatch(removeTaskAC(props.id, t.id));
          const onChangeTaskStatus = (event: ChangeEvent<HTMLInputElement>) => {
            dispatch(changeTaskStatusAC(props.id, t.id, event.currentTarget.checked))
          };

          const keyForLabel = v1();
          return (
            <li key={t.id} className={`${style.task_item}`}>
              <Tooltip title="completed">
                <Checkbox
                  color="primary"
                  size="medium"
                  id={keyForLabel}
                  checked={t.isDone}
                  onChange={onChangeTaskStatus}
                />
              </Tooltip>
              <label
                htmlFor={keyForLabel}
                className={`${t.isDone ? style.task_isDone : ""} `}>
                <EditableSpan
                  title={t.title}
                  newTitle={newTitle}
                  setNewTitle={setNewTitle}
                  toggleEditMode={t.editMode}
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
          );
        })}
      </ul>
    </div>
  );
});
