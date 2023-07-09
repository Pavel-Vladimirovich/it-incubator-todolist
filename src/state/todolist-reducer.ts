import {todolistsAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";

const initialState: TodolistStateType = []

export const todolistReducer = (state: TodolistStateType = initialState, action: ActionType): TodolistStateType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case "CREATE-TODOLIST":
            return [{...action.todolist, filter: FilterValuesType.all}, ...state]
        case "CHANGE-TODOLIST-TITLE":
            return [...state.map(tl => tl.id === action.id ? {...tl, title: action.title} : tl)]
        case "CHANGE-TODOLIST-FILTER":
            return [...state.map(tl => tl.id === action.id ? {...tl, filter: action.filterValue} :tl)]
        case "SET-TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: FilterValuesType.all}))
        default:
            return state;
    }
}

// action
export const removeTodolistAC = (todolistId: string) => ({type: 'REMOVE-TODOLIST', todolistId} as const)
export const createTodolistAC = (todolist: TodolistType) => ({type: "CREATE-TODOLIST", todolist} as const)
export const changeTodolistTitleAC = (id: string, title: string) => ({
    type: 'CHANGE-TODOLIST-TITLE',
    id,
    title
} as const)
export const changeTodolistFilterAC = (id: string, filterValue: FilterValuesType) => ({
    type: 'CHANGE-TODOLIST-FILTER',
    id,
    filterValue
} as const)
export const setTodolistAC = (todolists: Array<TodolistType>) => ({type: 'SET-TODOLISTS', todolists} as const)


// thunk
export const fetchTodolistTC = () => (dispatch: Dispatch<ActionType>) => {
    todolistsAPI.getTodolist()
        .then((response) => {
            dispatch(setTodolistAC(response.data))
        })
}
export const removeTodolistTC = (todolistId: string) => (dispatch: Dispatch<ActionType>) => {
    todolistsAPI.removeTodolist(todolistId)
        .then((response) => {
            dispatch(removeTodolistAC(todolistId))
        })
}
export const createTodolistTC = (title: string) => (dispatch: Dispatch<ActionType>) => {
    todolistsAPI.createTodolist(title)
        .then(response => {
            dispatch(createTodolistAC(response.data.data.item))
        })
}

// types
export enum FilterValuesType {
    all = "all",
    completed = "completed",
    active = "active",
}
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
}
type TodolistStateType = Array<TodolistDomainType>

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof createTodolistAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>

type ActionType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof changeTodolistTitleAC>
    | ReturnType<typeof changeTodolistFilterAC>