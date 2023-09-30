import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppError, setAppStatusRequest} from "../../app/app_reducer";
import {enums} from "../../enums";
import {todolistApi} from "../../api/todolist-api";
import {AxiosError, HttpStatusCode} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {setEntityStatus} from "./todolist-reducer";

export const fetchTodolistAsync = createAsyncThunk(
    'todolist/fetch',
    async (_, {dispatch, rejectWithValue}) => {
        try{
            dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
            const response = await todolistApi.getTodolist()
            if(response.status === HttpStatusCode.Ok){
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}))
                return {todolists: response.data}
            }
            else{
                dispatch(setAppError({error: "some error occurred"}))
                dispatch(setAppStatusRequest({status: enums.StatusRequest.failed}))
                return rejectWithValue('some error')
            }
        }catch(err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return rejectWithValue('some error')
        }
    }
)

export const updateTodolistTitleAsync = createAsyncThunk(
    'todolist/updateTitle',
    async (arg:{todolistId: string, title: string}, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
        dispatch(setEntityStatus({id: arg.todolistId, entityStatus: enums.StatusRequest.loading}))
        try{
            const response = await  todolistApi.updateTodolistTitle(arg.todolistId, arg.title)
            if(response.data.resultCode === enums.ResponseCode.Ok){
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}))
                dispatch(setEntityStatus({id: arg.todolistId, entityStatus: enums.StatusRequest.succeeded}))
                return{...arg}
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus({id: arg.todolistId, entityStatus: enums.StatusRequest.failed}))
                return rejectWithValue('some error')
            }
        }catch (err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return rejectWithValue('some error')
        }
    }
)

export const createTodolistAsync = createAsyncThunk(
    'todolist/create',
    async (title: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
        try{
            const response = await todolistApi.createTodolist(title)
            if(response.data.resultCode === enums.ResponseCode.Ok){
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}))
                return response.data.data.item
            }else{
                handleServerAppError(response.data, dispatch)
                return rejectWithValue('some error')
            }
        }catch(err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return rejectWithValue('some error')
        }
    }
)

export const removeTodolistAsync = createAsyncThunk(
    'todolist/remove',
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
        dispatch(setEntityStatus({id: todolistId, entityStatus: enums.StatusRequest.loading}))
        try{
            const response = await todolistApi.removeTodolist(todolistId)
            if(response.data.resultCode === enums.ResponseCode.Ok){
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}))
                return {todolistId}
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus({id: todolistId, entityStatus: enums.StatusRequest.failed}))
                return rejectWithValue('some error')
            }

        }catch(err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return rejectWithValue('some error')
        }
    }
)