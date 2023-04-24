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

type StateType = Array<TodolistType>

type RemoveTodolistActionType = ReturnType<typeof RemoveTodolistAC>
type AddTodolistActionType = ReturnType<typeof AddTodolistAC>
type ChangeTodolistTitleActionType = ReturnType<typeof ChangeTodolistTitleAC>
type ChangeTodolistFilterActionType = ReturnType<typeof ChangeTodolistFilterAC>

type ActionsType = RemoveTodolistActionType | AddTodolistActionType | ChangeTodolistTitleActionType | ChangeTodolistFilterActionType

export const todolistReducer = (state: StateType, action: ActionsType): StateType => {
    switch (action.type) {
        case 'REMOVE-TODOLIST':{
            return state.filter(tl => tl.id != action.id)
        }
        case "ADD-TODOLIST":{
            return [...state, {id: v1(), title: action.title, filter: FilterValuesType.all,}]
        }
        case "CHANGE-TODOLIST-TITLE":{
            const todolist = state.find((td) => td.id === action.id)
            if (todolist)
                todolist.title = action.title
            return [...state]
        }
        case "CHANGE-TODOLIST-FILTER":{
            const todolist = state.find((td) => td.id === action.id)
            if (todolist)
                todolist.filter = action.filter
            return [...state]
        }
        default:
            throw new Error("I don't understand this type")
    }
}

export const RemoveTodolistAC = (id: string) => ({type: 'REMOVE-TODOLIST', id: id} as const)
export const AddTodolistAC = (title: string) => ({type: "ADD-TODOLIST", title: title} as const)
export const ChangeTodolistTitleAC = (id: string, title: string) => ({type: 'CHANGE-TODOLIST-TITLE', id: id, title: title} as const)
export const ChangeTodolistFilterAC = (id: string, filter:FilterValuesType) => ({type: 'CHANGE-TODOLIST-FILTER', id: id, filter: filter} as const)