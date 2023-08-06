import {
    changeTodolistFilter,
    changeTodolistTitle,
    createTodolist,
    FilterValuesType,
    removeTodolist,
    setEntityStatus,
    setTodolist,
    TodolistDomainType,
    todolistReducer,
} from './todolist-reducer';
import {v1} from 'uuid';
import { StatusRequest } from '../../app/app_reducer';


const todolistId1 = v1();
const todolistId2 = v1();
const todolistId3 = v1();
const startState: Array<TodolistDomainType> = [
    {id: todolistId1, title: "What to learn", filter: FilterValuesType.all, entityStatus: StatusRequest.idle, order: 0, addedDate: '', editMode: false},
    {id: todolistId2, title: "What to buy", filter: FilterValuesType.all, entityStatus: StatusRequest.idle, order: 0, addedDate: '', editMode: false}
]

test('todolist should be correctly added', () => {
    const todolist = {id: todolistId3, title: "What to new", filter: FilterValuesType.all, order: 0, addedDate: ''}
    const endState = todolistReducer(startState, createTodolist(todolist))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe("What to buy");
});

test('todolist should be correctly removed', () => {
    const endState = todolistReducer(startState, removeTodolist(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('title of todolist should be correctly changed', () => {
    let newTodolistTitle = "New Todolist";
    const endState = todolistReducer(startState, changeTodolistTitle(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('filter of todolist should be correctly changed', () => {
    const endState = todolistReducer(startState, changeTodolistFilter(todolistId2, FilterValuesType.completed));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(FilterValuesType.completed);
});
test('entityStatus should be correctly changed', () => {
    const endState = todolistReducer(startState, setEntityStatus(todolistId1, StatusRequest.loading));

    expect(endState[0].entityStatus).toBe(StatusRequest.loading);
    expect(endState[1].entityStatus).toBe(StatusRequest.idle);
});

test('todolist should be correctly set', () => {
    const endState = todolistReducer(startState, setTodolist(startState));

    expect(endState.length).toBe(2);
});




