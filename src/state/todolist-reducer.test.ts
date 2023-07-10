import {
    createTodolistAC, changeTodolistFilterAC,
    changeTodolistTitleAC,
    FilterValuesType,
    removeTodolistAC, setTodolistAC, TodolistDomainType,
    todolistReducer,
} from './todolist-reducer';
import {v1} from 'uuid';

const todolistId1 = v1();
const todolistId2 = v1();
const todolistId3 = v1();
const startState: Array<TodolistDomainType> = [
    {id: todolistId1, title: "What to learn", filter: FilterValuesType.all, order: 0, addedDate: ''},
    {id: todolistId2, title: "What to buy", filter: FilterValuesType.all, order: 0, addedDate: ''}
]

test('todolist should be correctly added', () => {
    const todolist = {id: todolistId3, title: "What to new", filter: FilterValuesType.all, order: 0, addedDate: ''}
    const endState = todolistReducer(startState, createTodolistAC(todolist))

    expect(endState.length).toBe(3);
    expect(endState[2].title).toBe("What to new");
});

test('todolist should be correctly removed', () => {
    const endState = todolistReducer(startState, removeTodolistAC(todolistId1))

    expect(endState.length).toBe(1);
    expect(endState[0].id).toBe(todolistId2);
});

test('todolist should be correctly changed title', () => {
    let newTodolistTitle = "New Todolist";
    const endState = todolistReducer(startState, changeTodolistTitleAC(todolistId2, newTodolistTitle));

    expect(endState[0].title).toBe("What to learn");
    expect(endState[1].title).toBe(newTodolistTitle);
});

test('filter of todolist should be correctly changed', () => {
    const endState = todolistReducer(startState, changeTodolistFilterAC(todolistId2, FilterValuesType.completed));

    expect(endState[0].filter).toBe("all");
    expect(endState[1].filter).toBe(FilterValuesType.completed);
});

test('todolist should be correctly set', () => {
    const endState = todolistReducer(startState, setTodolistAC(startState));

    expect(endState.length).toBe(2);
});




