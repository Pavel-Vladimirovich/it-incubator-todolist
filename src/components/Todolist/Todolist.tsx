import React, { ChangeEvent, useState } from "react";
import style from "./Todolist.module.scss";
import { FilterValuesType } from "../../App";
import { v1 } from "uuid";
import { EditableSpan } from "../EditableSpan/EditableSpan";
import AddItemForm from "../AddItemForm/AddItemForm";
import {Button, Checkbox,
  Grid,
  IconButton,
  Tooltip,
  Fab, 
} from "@material-ui/core";
import DeleteIcon from "@material-ui/icons/Delete";
import AssignmentTurnedInIcon from "@material-ui/icons/AssignmentTurnedIn";
import ReceiptIcon from "@material-ui/icons/Receipt";
import BallotIcon from "@material-ui/icons/Ballot";
import BackspaceIcon from "@material-ui/icons/Backspace";
import EditIcon from "@material-ui/icons/Edit";

export type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
  editMode: boolean;
};

type PropsType = {
  id: string;
  title: string;
  tasks: Array<TaskType>;
  addTask: (title: string, todolistId: string) => void;
  changeFilter: (value: FilterValuesType, todolistId: string) => void;
  changeTaskStatus: (
    taskId: string,
    isDone: boolean,
    todolistId: string
  ) => void;
  filter: FilterValuesType;
  removeTask: (id: string, todolistId: string) => void;
  removeTodolist: (id: string) => void;
  changeTitleTask: (title: string, id: string, todolistId: string) => void;
  changeTitleTodolist: (title: string, todolistId: string) => void;
  toggleEditMode: (
    taskId: string,
    editMode: boolean,
    todolistId: string
  ) => void;
};

export const Todolist = (props: PropsType) => {
  const addTasksHandler = (title: string) => {
    props.addTask(title.trim(), props.id);
  };
  const changeTitleTodolistHandler = (title: string) => {
    props.changeTitleTodolist(title, props.id);
  };
  const removeTodolistHandler = () => {
    props.removeTodolist(props.id);
  };
  const onAllClickHandler = () => {
    props.changeFilter(FilterValuesType.all, props.id);
  };
  const onActiveClickHandler = () => {
    props.changeFilter(FilterValuesType.active, props.id);
  };
  const onCompletedClickHandler = () => {
    props.changeFilter(FilterValuesType.completed, props.id);
  };

  const [newTitle, setNewTitle] = useState("");

  return (
    <div className={style.todolist}>
      <div className={style.todolist_header}>
        <h3 className={style.header_title}>
          {/*<EditableSpan*/}
          {/*    title={props.title}*/}
          {/*    onChangeTitle={changeTitleTodolistHandler}*/}
          {/*/>*/}
        </h3>
        <Button
          variant="contained"
          color="primary"
          startIcon={<DeleteIcon />}
          onClick={removeTodolistHandler}
        >
          remove
        </Button>
      </div>
      <div className={style.todolist_input}>
        <AddItemForm addItem={addTasksHandler} textMessage="Note created successfully!"/>
      </div>
      <div className={style.todolist_filter}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={4}>
            <Button
              style={{ width: "100%" }}
              startIcon={<ReceiptIcon />}
              variant="contained"
              onClick={onAllClickHandler}
            >
              All
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              style={{ width: "100%" }}
              color={
                props.filter === FilterValuesType.active ? "primary" : "default"
              }
              startIcon={<BallotIcon />}
              variant="contained"
              onClick={onActiveClickHandler}
            >
              Active
            </Button>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button
              style={{ width: "100%" }}
              color={
                props.filter === FilterValuesType.completed ? "primary" : "default"
              }
              startIcon={<AssignmentTurnedInIcon />}
              variant="contained"
              onClick={onCompletedClickHandler}
            >
              Completed
            </Button>
          </Grid>
        </Grid>
      </div>
      <ul className={style.todolist_tasks}>
        {props.tasks.map((t) => {
          const activateEditMode = () => {
            props.toggleEditMode(t.id, true, props.id);
            setNewTitle(t.title);
          };
          const deactivateActivateEditMode = () => {
            props.toggleEditMode(t.id, false, props.id);
            props.changeTitleTask(newTitle, t.id, props.id);
          };
          const removeTaskHandler = () => props.removeTask(t.id, props.id);
          const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
            props.changeTaskStatus(t.id, event.currentTarget.checked, props.id);
          };
          const keyForLabel = v1();
          return (
            <li key={t.id} className={`${style.task_item}`}>
              <Tooltip title="completed">
                <Checkbox
                  color="primary"
                  size="small"
                  id={keyForLabel}
                  checked={t.isDone}
                  onChange={onChangeHandler}
                />
              </Tooltip>
              <label
                htmlFor={keyForLabel}
                className={`${t.isDone ? style.task_isDone : ""} `}
              >
                <EditableSpan
                  title={t.title}
                  newTitle={newTitle}
                  setNewTitle={setNewTitle}
                  toggleEditMode={t.editMode}
                  activateEditMode={activateEditMode}
                  deactivateActivateEditMode={deactivateActivateEditMode}
                />
              </label>
              <div className={style.item_btn_container}>
                <Tooltip title="Edit">
                  <IconButton
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                    }}
                    onClick={activateEditMode}
                    color="primary"
                    size="small"
                  >
                    <EditIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton
                    style={{
                      backgroundColor: "#3f51b5",
                      color: "white",
                    }}
                    size="small"
                    onClick={removeTaskHandler}
                  >
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
};
