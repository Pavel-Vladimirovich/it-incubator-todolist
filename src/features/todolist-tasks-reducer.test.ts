import {v1} from 'uuid';
import {createTodolist, FilterValuesType, TodolistDomainType, todolistReducer} from "./Todolist/todolist-reducer";
import {tasksReducer, TasksStateType} from "./Task/tasks-reducer";

const todolistId1 = v1()

test('ids should be equals', () => {
    const startTasksState: TasksStateType = {};
    const startTodolistsState: Array<TodolistDomainType> = [];

    const todolist = {id: todolistId1, title: "What to new", filter: FilterValuesType.all, order: 0, addedDate: ''}
    const action = createTodolist(todolist);

    const endTasksState = tasksReducer(startTasksState, action)
    const endTodolistsState = todolistReducer(startTodolistsState, action)

    const keys = Object.keys(endTasksState);
    const idFromTasks = keys[0];
    const idFromTodolists = endTodolistsState[0].id;

    expect(idFromTasks).toBe(action.payload.id);
    expect(idFromTodolists).toBe(action.payload.id);
});
