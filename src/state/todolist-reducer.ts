import {v1} from "uuid";

export enum FilterValuesType {
    all = "all",
    completed = "completed",
    active = "active",
}

export type TodolistType = {
    id: string;
    title: string;
    filter: FilterValuesType;
};

type TodolistStateType = Array<TodolistType>

export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>

type ActionsType = RemoveTodolistActionType
    | AddTodolistActionType
    | ChangeTodolistTitleActionType
    | ChangeTodolistFilterActionType

export const todolistId1 = v1();

const todolistsInitialState: TodolistStateType = []

export const todolistReducer = (state: TodolistStateType = todolistsInitialState, action: ActionsType): TodolistStateType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST': {
            return state.filter(tl => tl.id != action.todolistId)
        }
        case "ADD-TODOLIST": {
            return [...state, {id: action.todolistId, title: action.title, filter: FilterValuesType.all,}]
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