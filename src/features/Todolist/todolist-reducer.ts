import {
    setAppError,
    setAppStatusRequest,
    StatusRequest,
    } from "../../app/app_reducer";
import {todolistAPI, TodolistType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AppDispatch} from "../../app/store";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


export enum FilterValuesType {
    all = "all",
    completed = "completed",
    active = "active",
}

const initialState: TodolistStateType = []


const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers:{
        removeTodolist: (state, action: PayloadAction<{todolistId: string}>) => {
            const index = state.findIndex(t => t.id === action.payload.todolistId)
            if(index !== -1) state.splice(index, 1)
        },
        createTodolist: (state, action: PayloadAction<TodolistType>) => {
            state.unshift({...action.payload, filter: FilterValuesType.all, entityStatus: StatusRequest.idle})
        },
        changeTodolistTitle: (state, action: PayloadAction<{id: string, title: string}>) => {
           const todolist = state.find(item => item.id === action.payload.id)
           if(todolist) todolist.title = action.payload.title
        },
        changeTodolistFilter: (state, action: PayloadAction<{id: string, filter: FilterValuesType}>) => {
            const todolist = state.find(item => item.id === action.payload.id)
            if(todolist) todolist.filter = action.payload.filter
        },
        setEntityStatus: (state, action: PayloadAction<{id: string, entityStatus: StatusRequest}>) => {
            const todolist = state.find(item => item.id === action.payload.id)
            if(todolist) todolist.entityStatus = action.payload.entityStatus
        },
        setTodolist: (state, action: PayloadAction<{todolists: Array<TodolistType>}>) => {
            return action.payload.todolists.map(tl => ({...tl, filter: FilterValuesType.all, entityStatus: StatusRequest.idle}))
        }
    },
   
})

export const todolistReducer = slice.reducer
export const {changeTodolistFilter,changeTodolistTitle,createTodolist,removeTodolist,setEntityStatus,setTodolist} = slice.actions

// export const todolistReducer = (state: TodolistStateType = initialState, action: ActionType): TodolistStateType => {
//     switch (action.type) {
//         case "SET_TODOLISTS":
//             return action.todolists.map(tl => ({...tl, filter: FilterValuesType.all, entityStatus: StatusRequest.idle}))
//         case "CREATE_TODOLIST":
//             return [{...action.todolist, filter: FilterValuesType.all, entityStatus: StatusRequest.idle}, ...state]
//         case "REMOVE_TODOLIST":
//             return state.filter(tl => tl.id !== action.todolistId)
//         case "CHANGE_TODOLIST_TITLE":
//         case "CHANGE_TODOLIST_FILTER":
//         case "SET_ENTITY_STATUS":
//             return state.map(tl => tl.id === action.id ? {...tl, ...action.payloadType} : tl)
//         default:
//             return state;
//     }
// }

// actions
// export const removeTodolist = (todolistId: string) => ({type: "REMOVE_TODOLIST", todolistId} as const)
// export const createTodolist = (todolist: TodolistType) => ({type: "CREATE_TODOLIST", todolist} as const)
// export const changeTodolistTitle = (id: string, title: string) => ({
//     type: "CHANGE_TODOLIST_TITLE",
//     id,
//     payloadType: {title}
// } as const)
// export const changeTodolistFilter = (id: string, filter: FilterValuesType) => ({
//     type: "CHANGE_TODOLIST_FILTER",
//     id,
//     payloadType: {filter}
// } as const)
// export const setEntityStatus = (id: string, entityStatus: StatusRequest) => ({
//     type: "SET_ENTITY_STATUS",
//     id,
//     payloadType: {entityStatus}
// } as const)
// export const setTodolist = (todolists: Array<TodolistType>) => ({type: "SET_TODOLISTS", todolists} as const)

// thunks
export const fetchTodolistAsync = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatusRequest({status: StatusRequest.loading}))
    todolistAPI.getTodolist()
        .then((response) => {
            if(response.status === 200){
                dispatch(setTodolist({todolists: response.data}))
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
            }
            else{
                dispatch(setAppError({error: "some error occurred"}))
                dispatch(setAppStatusRequest({status: StatusRequest.failed}))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const updateTodolistTitleAsync = (todolistId: string, title: string) => {
    return (dispatch: AppDispatch )=> {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        dispatch(setEntityStatus({id: todolistId, entityStatus: StatusRequest.loading}))
        todolistAPI.updateTodolistTitle(todolistId ,title)
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(changeTodolistTitle({id: todolistId, title: title}))
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                dispatch(setEntityStatus({id: todolistId, entityStatus: StatusRequest.succeeded}))
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus({id: todolistId, entityStatus: StatusRequest.failed}))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })


    }
}
export const removeTodolistAsync = (todolistId: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusRequest({status: StatusRequest.loading}))
    dispatch(setEntityStatus({id: todolistId, entityStatus: StatusRequest.loading}))
    todolistAPI.removeTodolist(todolistId)
        .then((response) => {
            if(response.data.resultCode === 0){
                dispatch(removeTodolist({todolistId: todolistId}))
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus({id: todolistId, entityStatus: StatusRequest.failed}))
            }
            
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}
export const createTodolistAsync = (title: string) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusRequest({status: StatusRequest.loading}))
    todolistAPI.createTodolist(title)
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(createTodolist(response.data.data.item))
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
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
