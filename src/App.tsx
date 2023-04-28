import React, { useState } from "react";
import style from "./App.module.scss";
import { v1 } from "uuid";
import { TaskType, Todolist } from "./components/Todolist/Todolist";
import AddItemForm from "./components/AddItemForm/AddItemForm";
import { Container, Grid, Paper } from "@material-ui/core";
import HideAppBar from "./components/MenuAppBar/HideAppBar";

enum FilterValuesType {
  all = "all",
  completed = "completed",
  active = "active",
}

type TodolistType = {
  id: string;
  title: string;
  filter: FilterValuesType;
};
type TasksType = {
  [key: string]: Array<TaskType>;
};

function App() {
  const todolistId1 = v1();
  const todolistId2 = v1();

  let [todolists, setTodolists] = useState<Array<TodolistType>>([
    {
      id: todolistId1,
      title: "What to learn",
      filter: FilterValuesType.all,
    },
    {
      id: todolistId2,
      title: "What to buy",
      filter: FilterValuesType.all,
    },
  ]);

  let [tasks, setTasks] = useState<TasksType>({
    [todolistId1]: [
      {
        id: v1(),
        title:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
        isDone: false,
        editMode: false,
      },
      {
        id: v1(),
        title:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
        isDone: false,
        editMode: false,
      },
      {
        id: v1(),
        title:
          "React, Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo",
        isDone: false,
        editMode: false,
      },
      {
        id: v1(),
        title:
          "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eligendi illo mollitia obcaecati quae qui. Accusamus at commodi consequatur corporis, debitis dolorem est fugit illo ipsa, laborum minus modi non nulla omnis perferendis possimus quam quasi, quidem quod rem reprehenderit repudiandae saepe tenetur. At distinctio eum laudantium, natus perspiciatis quam quod?",
        isDone: false,
        editMode: false,
      },
    ],
    [todolistId2]: [
      { id: v1(), title: "Bread", isDone: false, editMode: false },
      { id: v1(), title: "Milk", isDone: false, editMode: false },
      { id: v1(), title: "Meet", isDone: false, editMode: false },
      { id: v1(), title: "Fish", isDone: false, editMode: false },
    ],
  });
  console.log(tasks[todolistId1][0].title)

  function changeFilter(todolistId: string, value: FilterValuesType) {
    const todolist = todolists.find((tl) => tl.id === todolistId);
    if (todolist) {
      todolist.filter = value;
      setTodolists([...todolists]);
    }
  }

  function changeTitleTodolist(title: string, id: string) {
    const todolist = todolists.find((td) => td.id === id);
    if (todolist) {
      todolist.title = title;
      setTodolists([...todolists]);
    }
  }

  function changeTitleTask(title: string, taskId: string, todolistId: string) {
    const task = tasks[todolistId].find((t) => t.id === taskId);
    if (task) task.title = title;
    setTasks({ ...tasks });
  }

  function removeTask(id: string, todolistId: string) {
    tasks[todolistId] = tasks[todolistId].filter((t) => t.id !== id);
    setTasks({ ...tasks });
  }

  function addTask(title: string, todolistId: string) {
    const task = { id: v1(), title: title, isDone: false, editMode: false };
    tasks[todolistId] = [task, ...tasks[todolistId]];
    setTasks({ ...tasks });
  }

  function changeTaskStatus(todolistId: string, taskId: string, isDone: boolean) {
    const task = tasks[todolistId].find((t) => t.id === taskId);
    if (task) {
      task.isDone = isDone;
    }
    setTasks({ ...tasks });
  }

  function addTodolist(title: string) {
    const todolist: TodolistType = {
      id: v1(),
      title: title,
      filter: FilterValuesType.all,
    };
    setTodolists([...todolists, todolist]);
    setTasks({ ...tasks, [todolist.id]: [] });
  }

  function removeTodolist(id: string) {
    todolists = todolists.filter((tl) => tl.id !== id);
    delete tasks[id];
    setTodolists([...todolists]);
  }
  function toggleEditMode(
    taskId: string,
    editMode: boolean,
    todolistId: string
  ) {
    const task = tasks[todolistId].find((t) => t.id === taskId);
    if (task) {
      task.editMode = editMode;
    }
    setTasks({ ...tasks });
  }

  return (
    <>
    <HideAppBar/>
      <Container maxWidth="xl">
        <Grid container spacing={3}>
          <Grid item xs={12} style={{ textAlign: "center", marginTop: "20px" }}>
            <h1 className={style.header_title}></h1>
            <AddItemForm
              addItem={addTodolist}
              textMessage="Todolist created successfully!"
            />
          </Grid>
          {todolists.map((tl) => {
            let tasksForTodolist = tasks[tl.id];
            if (tl.filter === FilterValuesType.completed) {
              tasksForTodolist = tasksForTodolist.filter((t) => t.isDone);
            }
            if (tl.filter === FilterValuesType.active) {
              tasksForTodolist = tasksForTodolist.filter((t) => !t.isDone);
            }
            return (
              <Grid item xs={12} md={6}>
                <Paper
                  elevation={3}
                  variant="outlined"
                  style={{ padding: "10px" }}
                >
                  <Todolist
                    id={tl.id}
                    key={tl.id}
                    title={tl.title}
                    tasks={tasksForTodolist}
                    addTask={addTask}
                    changeTaskStatus={changeTaskStatus}
                    changeFilter={changeFilter}
                    filter={tl.filter}
                    changeTitleTask={changeTitleTask}
                    removeTask={removeTask}
                    changeTitleTodolist={changeTitleTodolist}
                    removeTodolist={removeTodolist}
                    toggleEditMode={toggleEditMode}
                  />
                </Paper>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </>
  );
}

export default App;
