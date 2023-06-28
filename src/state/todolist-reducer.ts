import {v1} from "uuid";
import {todolistsAPI, TodolistType} from "../api/todolist-api";

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
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
type SetTodolistActionType = ReturnType<typeof setTodolistAC>

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
        case "ADD-TODOLIST": {
            return [...state, {
                id: action.todolistId,
                title: action.title,
                filter: FilterValuesType.all,
                order: 0,
                addedDate: '00.00'
            }]
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
          return action.todolists.map(tl => {
              return {
                  ...tl,
                  filter: FilterValuesType.all
              }
          })
        }
        default:
            return state;
    }
}

export const removeTodolistAC = (todolistId: string) => ({
    type: 'REMOVE-TODOLIST',
    todolistId
} as const)
export const addTodolistAC = (title: string) => ({
    type: "ADD-TODOLIST",
    title,
    todolistId: v1()
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
    return (dispatch: any) => {
        todolistsAPI.getTodolist()
            .then((response) => {
                dispatch(setTodolistAC(response.data))
            })
    }

}
