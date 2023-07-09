import {v1} from "uuid";

import {
    createTaskAC,
    changeTaskStatusAC,
    updateTaskAC,
    removeTaskAC, setTasksAC,
    tasksReducer,
    TasksStateType,
    toggleTaskEditModeAC
} from "./tasks-reducer";
import {createTodolistAC, FilterValuesType, removeTodolistAC, setTodolistAC, TodolistDomainType} from "./todolist-reducer";
import {TaskPriority, TaskStatus, TaskType} from "../api/todolist-api";

const todolistId1 = v1();
const todolistId2 = v1();
const todolistId3 = v1();
const taskId1 = v1();
const taskId2 = v1();
const taskId3 = v1();

const startState: TasksStateType = {
    [todolistId1]: [
        {id: taskId1, title: "Bread", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId2, title: "Milk", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId3, title: "Chocolate", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
    ],
    [todolistId2]: [
        {id: taskId1, title: "CSS", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId2, title: "JS", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId3, title: "React", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''}
    ]
};

test("task should be correctly created", () => {
    const newTask: TaskType = {id: '2', title: "Lettuce", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: todolistId1}
    const endState = tasksReducer(startState, createTaskAC(newTask));

    expect(endState[todolistId1].length).toBe(4);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1][0].title).toBe(newTask.title);
    expect(endState[todolistId1][0].status).toBe(TaskStatus.New);

});

test("task should be correctly removed", () => {
    const endState = tasksReducer(startState, removeTaskAC(todolistId1, taskId1));
    expect(endState[todolistId1].length).toBe(2);
    expect(endState[todolistId2].length).toBe(3);
});

test("title task should be correctly changed", () => {
    const newTaskTitle = 'Chocolate'
    const endState = tasksReducer(startState, updateTaskAC(todolistId1, taskId1, newTaskTitle));

    expect(endState[todolistId1][0].title).toBe(newTaskTitle);
    expect(startState[todolistId1][0].title).toBe('Bread');
    expect(endState[todolistId2].length).toBe(3);
});

test("task status should be correctly changed", () => {
    const endState = tasksReducer(startState, changeTaskStatusAC(todolistId1, taskId1, TaskStatus.Completed));

    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1][0].status).toBe(TaskStatus.Completed);
    expect(startState[todolistId1][0].status).toBe(TaskStatus.New);
});

test("task toggle editMode should be correctly changed", () => {
    const endState = tasksReducer(startState, toggleTaskEditModeAC(todolistId1, taskId1, true));

    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1][0].editMode).toBeTruthy();
    expect(startState[todolistId1][0].editMode).toBeFalsy();
});

test('new array should be correctly added when new todolist is added', () => {
    const todolist = {id: todolistId3, title: "What to new", filter: FilterValuesType.all, order: 0, addedDate: ''}
    const endState = tasksReducer(startState, createTodolistAC(todolist))
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != todolistId1 && k != todolistId2);
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
 });

test('property with todolistId should be correctly deleted', () => {
    const endState = tasksReducer(startState, removeTodolistAC(todolistId2))
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState[todolistId2]).not.toBeDefined();
});

test('tasks should be correctly set', () => {
    const action: Array<TodolistDomainType> = [
        {id: todolistId1, title: "What to learn", filter: FilterValuesType.all, order: 0, addedDate: ''},
        {id: todolistId2, title: "What to buy", filter: FilterValuesType.all, order: 0, addedDate: ''}
    ]
    const endState = tasksReducer({}, setTodolistAC(action))
    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState[todolistId1]).toStrictEqual([])
    expect(endState[todolistId2]).toStrictEqual([])
});
test('tasks should be correctly added for todolist', () => {
    const startState = {
        "todolistId1": [],
        "todolistId2": []
    }
    const tasks = [
        {id: taskId1, title: "Bread", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId2, title: "Milk", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
    ]

    const endState = tasksReducer(startState, setTasksAC( 'todolistId1', tasks))
    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['todolistId1'].length).toBe(2)
    expect(endState['todolistId2'].length).toBe(0)
});

