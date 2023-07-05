import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolist-api";
import {Dispatch} from "redux";


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
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistAC>

type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType
    | SetTodolistActionType

const initialState: TodolistStateType = []

export const todolistReducer = (state: TodolistStateType = initialState, action: ActionsType): TodolistStateType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id !== action.todolistId)
        }
        case "CREATE-TODOLIST": {
            return [{...action.todolist, filter: FilterValuesType.all}, ...state]
        }
        case "CHANGE-TODOLIST-TITLE": {
            const todolist = state.find((td) => td.id === action.id)
            if (todolist)
                todolist.title = action.title
            return [...state]
        }
        case "CHANGE-TODOLIST-FILTER": {
            const todolist = state.find((td) => td.id === action.id)
            if (todolist)
                todolist.filter = action.filterValue
            return [...state]
        }
        case "SET-TODOLISTS": {
            return action.todolists.map(tl => ({...tl, filter: FilterValuesType.all}))
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string) => ({
    type: 'REMOVE-TODOLIST',
    todolistId
} as const)
export const createTodolistAC = (todolist: TodolistType) => ({
    type: "CREATE-TODOLIST",
    todolist,
} as const)
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
export const setTodolistAC = (todolists: Array<TodolistType>) => ({
    type: 'SET-TODOLISTS',
    todolists
} as const)


export const fetchTodolistTC = () => {
    return (dispatch: Dispatch) => {
        todolistsAPI.getTodolist()
            .then((response) => {
                dispatch(setTodolistAC(response.data))
            })
    }
}

export const removeTodolistTC = (todolistId: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.removeTodolist(todolistId)
            .then((response) => {
                dispatch(removeTodolistAC(todolistId))
            })
    }
}
export const createTodolistTC = (title: string) => {
    return (dispatch: Dispatch) => {
        todolistsAPI.createTodolist(title)
            .then(response => {
               dispatch(createTodolistAC(response.data.data.item))
            })
    }
}