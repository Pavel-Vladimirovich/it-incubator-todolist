import { v1 } from "uuid";
import { TasksObjType } from "../App";
import { changeTitleTaskAC, removeTaskAC, tasksReducer } from "./tasks-reducer";

test("correct title task should be changed", () => {
  const todolistId1 = v1();
  const taskId1 = v1();
  const taskId2 = v1();
  const newTaskTitle = 'Carrot'

  const startState: TasksObjType = {
    [todolistId1]: [
      { id: taskId1, title: "Bread", isDone: false, editMode: false },
      { id: taskId2, title: "Milk", isDone: false, editMode: false },
    ],
  };

const endState = tasksReducer(startState, changeTitleTaskAC(todolistId1, taskId1, newTaskTitle));
expect(endState[todolistId1][0].title).toBe(newTaskTitle)
});


test("correct task should be removed", () => {
  const todolistId1 = v1();
  const taskId1 = v1();
  const taskId2 = v1();

  const startState: TasksObjType = {
    [todolistId1]: [
      { id: taskId1, title: "Bread", isDone: false, editMode: false },
      { id: taskId2, title: "Milk", isDone: false, editMode: false },
    ],
  };
  const endState = tasksReducer(startState, removeTaskAC(todolistId1, taskId1));
  expect(endState[todolistId1][1]).toBe(endState[todolistId1][0])
});
