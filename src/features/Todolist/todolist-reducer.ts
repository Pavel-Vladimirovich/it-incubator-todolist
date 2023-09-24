import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError, HttpStatusCode } from "axios";
import { todolistApi, TodolistType } from "../../api/todolist-api";
import {
    setAppError,
    setAppStatusRequest,
} from "../../app/app_reducer";
import { ResponseCode } from "../../enums/ResponseCode";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import {FilterValues} from "../../enums/filterValues";
import {StatusRequest} from "../../enums/statusRequest";


export const fetchTodolistAsync = createAsyncThunk(
    'todolist/fetch',
    async (_, {dispatch}) => {
        try{
            dispatch(setAppStatusRequest({status: StatusRequest.loading}))
            const response = await todolistApi.getTodolist()
            if(response.status === HttpStatusCode.Ok){
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
    'todolist/updateTitle',
    async (arg:{todolistId: string, title: string}, {dispatch}) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        dispatch(setEntityStatus({id: arg.todolistId, entityStatus: StatusRequest.loading}))
        try{
            const response = await  todolistApi.updateTodolistTitle(arg.todolistId, arg.title)
            if(response.data.resultCode === ResponseCode.Ok){
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                dispatch(setEntityStatus({id: arg.todolistId, entityStatus: StatusRequest.succeeded}))
                return{...arg}
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus({id: arg.todolistId, entityStatus: StatusRequest.failed}))
            }
        }catch (err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
        }
    }
)

export const createTodolistAsync = createAsyncThunk(
    'todolist/create',
    async (title: string, {dispatch}) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        try{
            const response = await todolistApi.createTodolist(title)
            if(response.data.resultCode === ResponseCode.Ok){
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                return response.data.data.item
            }else{
                handleServerAppError(response.data, dispatch)
            }
        }catch(err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
        }
    }
)

export const removeTodolistAsync = createAsyncThunk(
    'todolist/remove',
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        dispatch(setEntityStatus({id: todolistId, entityStatus: StatusRequest.loading}))
        try{
            const response = await todolistApi.removeTodolist(todolistId)
            if(response.data.resultCode === ResponseCode.Ok){
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                return {todolistId}
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus({id: todolistId, entityStatus: StatusRequest.failed}))
            }

        }catch(err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
        }
    }
)

const initialState: TodolistStateType = []

const slice = createSlice({
    name: 'todolist',
    initialState,
    reducers:{
        changeTodolistFilter: (state, action: PayloadAction<{id: string, filter: FilterValues}>) => {
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
            return action.payload.todolists.map(item => ({...item, filter: FilterValues.all, entityStatus: StatusRequest.idle}))
        })
        .addCase(updateTodolistTitleAsync.fulfilled, (state, action) => {
          if(action.payload){
              const todolist = state.find(item => item.id === action.payload?.todolistId)
              if(todolist) todolist.title = action.payload.title
          }
        })
        .addCase(createTodolistAsync.fulfilled, (state, action) => {
            if(action.payload)
            state.unshift({...action.payload, filter: FilterValues.all, entityStatus: StatusRequest.idle})

        })
        .addCase(removeTodolistAsync.fulfilled, (state, action) => {
                const index = state.findIndex(item => item.id === action.payload?.todolistId)
                if(index !== -1) state.splice(index, 1)
        })
    }
   
})

export const todolistReducer = slice.reducer
export const {changeTodolistFilter,setEntityStatus} = slice.actions

// types
export type TodolistDomainType = TodolistType & {
    filter: FilterValues
    entityStatus: StatusRequest
}
type TodolistStateType = Array<TodolistDomainType>
