import {v1} from "uuid";

import {
    createTask,
    removeTask,
    setTasks,
    tasksReducer,
    TasksStateType,
    updateTask
} from "./tasks-reducer";

import {StatusRequest} from "../../app/app_reducer";
import {TaskPriority, TaskStatus, TaskType} from "../../api/todolist-api";
import {
    createTodolist,
    FilterValuesType,
    removeTodolist,
    setTodolist,
    TodolistDomainType
} from "../Todolist/todolist-reducer";

const todolistId1 = v1();
const todolistId2 = v1();
const todolistId3 = v1();
const taskId1 = v1();
const taskId2 = v1();
const taskId3 = v1();

const startState: TasksStateType = {
    [todolistId1]: [
        {id: taskId1, title: "Bread", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId2, title: "Milk", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId3, title: "Chocolate", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
    ],
    [todolistId2]: [
        {id: taskId1, title: "CSS", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId2, title: "JS", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        {id: taskId3, title: "React", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''}
    ]
};

test("task should be correctly created", () => {
    const newTask: TaskType = {id: '2', title: "Lettuce", addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: todolistId1}
    const endState = tasksReducer(startState, createTask({task: newTask}));

    expect(endState[todolistId1].length).toBe(4);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1][0].title).toBe(newTask.title);
    expect(endState[todolistId1][0].status).toBe(TaskStatus.New);

});

test("task should be correctly removed", () => {
    const endState = tasksReducer(startState, removeTask({todolistId: todolistId1, taskId: taskId1}));
    expect(endState[todolistId1].length).toBe(2);
    expect(endState[todolistId2].length).toBe(3);
});

test("title task should be correctly changed", () => {
    const newTaskTitle = 'Chocolate'
    const endState = tasksReducer(startState, updateTask({todolistId:todolistId1, taskId: taskId1, domainModel: {title: newTaskTitle}}));

    expect(endState[todolistId1][0].title).toBe(newTaskTitle);
    expect(startState[todolistId1][0].title).toBe('Bread');
    expect(endState[todolistId2].length).toBe(3);
});

test("task status should be correctly changed", () => {
    const endState = tasksReducer(startState, updateTask({todolistId: todolistId1, taskId: taskId1, domainModel: {status: TaskStatus.Completed}}));

    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1][0].status).toBe(TaskStatus.Completed);
    expect(startState[todolistId1][0].status).toBe(TaskStatus.New);
});

// test("task toggle editMode should be correctly changed", () => {
//     const endState = tasksReducer(startState, toggleTaskEditMode(todolistId1, taskId1, true));
//
//     expect(endState[todolistId1].length).toBe(3);
//     expect(endState[todolistId2].length).toBe(3);
//     expect(endState[todolistId1][0].editMode).toBeTruthy();
//     expect(startState[todolistId1][0].editMode).toBeFalsy();
// });

test('new array should be correctly added when new todolist is added', () => {
    const todolist = {id: todolistId3, title: "What to new", filter: FilterValuesType.all, order: 0, addedDate: ''}
    const endState = tasksReducer(startState, createTodolist(todolist))
    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != todolistId1 && k != todolistId2);
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
 });

test('property with todolistId should be correctly deleted', () => {
    const endState = tasksReducer(startState, removeTodolist({todolistId: todolistId2}))
    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState[todolistId2]).not.toBeDefined();
});

test('tasks should be correctly set', () => {
    const action: Array<TodolistDomainType> = [
        {id: todolistId1, title: "What to learn", filter: FilterValuesType.all, entityStatus: StatusRequest.idle, order: 0, addedDate: ''},
        {id: todolistId2, title: "What to buy", filter: FilterValuesType.all, entityStatus: StatusRequest.idle, order: 0, addedDate: ''}
    ]
    const endState = tasksReducer({}, setTodolist({todolists: action}))
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

    const endState = tasksReducer(startState, setTasks( {todolistId: 'todolistId1', tasks}))
    const keys = Object.keys(endState);

    expect(keys.length).toBe(2);
    expect(endState['todolistId1'].length).toBe(2)
    expect(endState['todolistId2'].length).toBe(0)
});

