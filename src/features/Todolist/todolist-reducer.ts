import {Dispatch} from "redux";
import {
    ErrorActionType,
    setAppError,
    setAppStatusRequest,
    StatusRequest,
    StatusRequestActionType
} from "../../app/app_reducer";
import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";


export enum FilterValuesType {
    all = "all",
    completed = "completed",
    active = "active",
}

const initialState: TodolistStateType = []

export const todolistReducer = (state: TodolistStateType = initialState, action: ActionType): TodolistStateType => {
    switch (action.type) {
        case "SET_TODOLISTS":
            return action.todolists.map(tl => ({...tl, filter: FilterValuesType.all, entityStatus: StatusRequest.idle}))
        case "CREATE_TODOLIST":
            return [{...action.todolist, filter: FilterValuesType.all, entityStatus: StatusRequest.idle}, ...state]
        case 'REMOVE_TODOLIST':
            return state.filter(tl => tl.id !== action.todolistId)
        case "CHANGE_TODOLIST_TITLE":
        case "CHANGE_TODOLIST_FILTER":
        case "SET_ENTITY_STATUS":
            return state.map(tl => tl.id === action.id ? {...tl, ...action.payloadType} : tl)
        default:
            return state;
    }
}

// actions
export const removeTodolist = (todolistId: string) => ({type: 'REMOVE_TODOLIST', todolistId} as const)
export const createTodolist = (todolist: TodolistType) => ({type: "CREATE_TODOLIST", todolist} as const)
export const changeTodolistTitle = (id: string, title: string) => ({
    type: 'CHANGE_TODOLIST_TITLE',
    id,
    payloadType: {title}
} as const)
export const changeTodolistFilter = (id: string, filter: FilterValuesType) => ({
    type: 'CHANGE_TODOLIST_FILTER',
    id,
    payloadType: {filter}
} as const)
export const setEntityStatus = (id: string, entityStatus: StatusRequest) => ({
    type: "SET_ENTITY_STATUS",
    id,
    payloadType: {entityStatus}
} as const)
export const setTodolist = (todolists: Array<TodolistType>) => ({type: 'SET_TODOLISTS', todolists} as const)

// thunks
export const fetchTodolistAsync = () => (dispatch: Dispatch<ActionType | StatusRequestActionType | ErrorActionType>) => {
    dispatch(setAppStatusRequest(StatusRequest.loading))
    todolistAPI.getTodolist()
        .then((response) => {
            if(response.status === 200){
                dispatch(setTodolist(response.data))
                dispatch(setAppStatusRequest(StatusRequest.succeeded))
            }
            else{
                dispatch(setAppError('some error occurred'))
                dispatch(setAppStatusRequest(StatusRequest.failed))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const updateTodolistTitleAsync = (todolistId: string, title: string) => {
    return (dispatch: Dispatch<ActionType | StatusRequestActionType> )=> {
        dispatch(setAppStatusRequest(StatusRequest.loading))
        dispatch(setEntityStatus(todolistId, StatusRequest.loading))
        todolistAPI.updateTodolistTitle(todolistId ,title)
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(changeTodolistTitle(todolistId, title))
                dispatch(setAppStatusRequest(StatusRequest.succeeded))
                dispatch(setEntityStatus(todolistId, StatusRequest.succeeded))
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus(todolistId, StatusRequest.failed))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })


    }
}
export const removeTodolistAsync = (todolistId: string) => (dispatch: Dispatch<ActionType | StatusRequestActionType>) => {
    dispatch(setAppStatusRequest(StatusRequest.loading))
    dispatch(setEntityStatus(todolistId, StatusRequest.loading))
    todolistAPI.removeTodolist(todolistId)
        .then((response) => {
            if(response.data.resultCode === 0){
                dispatch(removeTodolist(todolistId))
                dispatch(setAppStatusRequest(StatusRequest.succeeded))
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus(todolistId, StatusRequest.failed))
            }
            
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const createTodolistAsync = (title: string) => (dispatch: Dispatch<ActionType | StatusRequestActionType>) => {
    dispatch(setAppStatusRequest(StatusRequest.loading))
    todolistAPI.createTodolist(title)
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(createTodolist(response.data.data.item))
                dispatch(setAppStatusRequest(StatusRequest.succeeded))
            }else{
                handleServerAppError(response.data, dispatch)
            }

        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: StatusRequest
}
type TodolistStateType = Array<TodolistDomainType>

export type RemoveTodolistActionType = ReturnType<typeof removeTodolist>
export type AddTodolistActionType = ReturnType<typeof createTodolist>
export type SetTodolistActionType = ReturnType<typeof setTodolist>

type ActionType =
    | RemoveTodolistActionType
    | AddTodolistActionType
    | SetTodolistActionType
    | ReturnType<typeof changeTodolistTitle>
    | ReturnType<typeof changeTodolistFilter>
    | ReturnType<typeof setEntityStatus>
