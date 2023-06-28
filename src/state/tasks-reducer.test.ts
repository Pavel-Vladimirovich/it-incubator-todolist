import {v1} from "uuid";

import {
    addTaskAC,
    changeTaskStatusAC,
    changeTaskTitleAC,
    removeTaskAC,
    tasksReducer,
    TasksStateType,
    toggleTaskEditModeAC
} from "./tasks-reducer";
import {addTodolistAC, removeTodolistAC} from "./todolist-reducer";
import {TaskPriority, TaskStatus} from "../api/todolist-api";

test("correct task should be added", () => {
    const todolistId1 = v1();
    const todolistId2 = v1();
    const taskId1 = v1();
    const taskId2 = v1();
    const taskId3 = v1();

    const newTitleTask = 'Chocolate'

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: taskId1, title: "Bread",editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
            {id: taskId2, title: "Milk", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        ],
        [todolistId2]: [
            {id: taskId1, title: "CSS", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
            {id: taskId2, title: "JS", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
            {id: taskId3, title: "React", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''}
        ]
    };
    const endState = tasksReducer(startState, addTaskAC(todolistId1, newTitleTask));
    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1][0].id).toBeDefined();
    expect(endState[todolistId1][0].title).toBe(newTitleTask);
    expect(endState[todolistId1][0].status).toBe(TaskStatus.Completed);

});

test("correct task should be removed", () => {
    const todolistId1 = v1();
    const todolistId2 = v1();
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

    const endState = tasksReducer(startState, removeTaskAC(todolistId1, taskId1));
    expect(endState[todolistId1].length).toBe(2);
    expect(endState[todolistId2].length).toBe(3);
});

test("correct title task should be changed", () => {
    const todolistId1 = v1();
    const todolistId2 = v1();
    const taskId1 = v1();
    const taskId2 = v1();
    const taskId3 = v1();

    const newTaskTitle = 'Chocolate'

    const startState: TasksStateType = {
        [todolistId1]: [
            {id: taskId1, title: "Bread", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
            {id: taskId2, title: "Milk", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        ],
        [todolistId2]: [
            {id: taskId1, title: "CSS", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
            {id: taskId2, title: "JS", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
            {id: taskId3, title: "React", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''}
        ]
    };

    const endState = tasksReducer(startState, changeTaskTitleAC(todolistId1, taskId1, newTaskTitle));
    expect(endState[todolistId1][0].title).toBe(newTaskTitle);
    expect(startState[todolistId1][0].title).toBe('Bread');
    expect(endState[todolistId2].length).toBe(3);
});

test("correct task status should be changed", () => {
    const todolistId1 = v1();
    const todolistId2 = v1();
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
            {id: taskId1, title: "Bread", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
            {id: taskId2, title: "Milk", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
            {id: taskId3, title: "Chocolate", editMode: false, addedDate: '', startDate: '', deadline: '', order: 0, status: TaskStatus.New, priority: TaskPriority.Low, description: '', todoListId: ''},
        ]
    };
    const endState = tasksReducer(startState, changeTaskStatusAC(todolistId1, taskId1, TaskStatus.Completed));
    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1][0].status).toBe(TaskStatus.Completed);
    expect(startState[todolistId1][0].status).toBe(TaskStatus.New);
});

test("correct task toggleEditMode should be changed", () => {
    const todolistId1 = v1();
    const todolistId2 = v1();
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
    const endState = tasksReducer(startState, toggleTaskEditModeAC(todolistId1, taskId1, true));
    expect(endState[todolistId1].length).toBe(3);
    expect(endState[todolistId2].length).toBe(3);
    expect(endState[todolistId1][0].editMode).toBeTruthy();
    expect(startState[todolistId1][0].editMode).toBeFalsy();
});

test('new array should be added when new todolist is added', () => {

    const todolistId1 = v1();
    const todolistId2 = v1();
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

    const endState = tasksReducer(startState, addTodolistAC("new todolist"))

    const keys = Object.keys(endState);
    const newKey = keys.find(k => k != todolistId1 && k != todolistId2);
    if (!newKey) {
        throw Error("new key should be added")
    }

    expect(keys.length).toBe(3);
    expect(endState[newKey]).toEqual([]);
 });

test('property with todolistId should be deleted', () => {
    const todolistId1 = v1();
    const todolistId2 = v1();
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


    const endState = tasksReducer(startState, removeTodolistAC(todolistId2))


    const keys = Object.keys(endState);

    expect(keys.length).toBe(1);
    expect(endState[todolistId2]).not.toBeDefined();
});

