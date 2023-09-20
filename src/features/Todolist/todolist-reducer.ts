import {
    setAppError,
    setAppStatusRequest,
    StatusRequest,
    } from "../../app/app_reducer";
import {todolistApi, TodolistType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AppRootDispatch} from "../../app/store";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError } from "axios";


export enum FilterValuesType {
    all = "all",
    completed = "completed",
    active = "active",
}

export const fetchTodolistAsync = createAsyncThunk(
    'todolist/fetch',
    async (_, {dispatch}) => {
        try{
            dispatch(setAppStatusRequest({status: StatusRequest.loading}))
            const response = await todolistApi.getTodolist()
            if(response.status === 200){
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                return {todolists: response.data}
            }
            else{
                dispatch(setAppError({error: "some error occurred"}))
                dispatch(setAppStatusRequest({status: StatusRequest.failed}))
            }
        }catch(err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
        }
    }
)

export const updateTodolistTitleAsync = createAsyncThunk(
    'todolist/updateTodolistTitle',
    async (arg:{todolistId: string, title: string}, {dispatch}) => {
        try{
            dispatch(setAppStatusRequest({status: StatusRequest.loading}))
            dispatch(setEntityStatus({id: arg.todolistId, entityStatus: StatusRequest.loading}))
            const response = await  todolistApi.updateTodolistTitle(arg.todolistId, arg.title)
            if(response.data.resultCode === 0){
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                dispatch(setEntityStatus({id: arg.todolistId, entityStatus: StatusRequest.succeeded}))
                return{...arg}
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus({id: arg.todolistId, entityStatus: StatusRequest.failed}))
                return
            }
        }catch (err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return
        }
    }
)

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
    },
    extraReducers: (builder)=> {
        builder
        .addCase(fetchTodolistAsync.fulfilled, (state, action)=>{
            if(action.payload)
            return action.payload.todolists.map(tl => ({...tl, filter: FilterValuesType.all, entityStatus: StatusRequest.idle}))
        })
        .addCase(updateTodolistTitleAsync.fulfilled, (state, action) => {
          if(action.payload){
              const todolist = state.find(item => item.id === action.payload?.todolistId)
              if(todolist) todolist.title = action.payload.title
          }
        })
    }
   
})

export const todolistReducer = slice.reducer
export const {changeTodolistFilter,changeTodolistTitle,createTodolist,removeTodolist,setEntityStatus} = slice.actions

export const removeTodolistAsync = (todolistId: string) => (dispatch: AppRootDispatch) => {
    dispatch(setAppStatusRequest({status: StatusRequest.loading}))
    dispatch(setEntityStatus({id: todolistId, entityStatus: StatusRequest.loading}))
    todolistApi.removeTodolist(todolistId)
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
export const createTodolistAsync = (title: string) => (dispatch: AppRootDispatch) => {
    dispatch(setAppStatusRequest({status: StatusRequest.loading}))
    todolistApi.createTodolist(title)
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
