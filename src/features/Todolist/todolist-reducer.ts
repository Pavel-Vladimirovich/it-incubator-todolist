import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {todolistApi, TodolistType} from "../../api/todolist-api";
import {enums} from "../../enums";
import {setAppError, setAppStatusRequest} from "../../app/app_reducer";
import {AxiosError, HttpStatusCode} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const fetchTodolistAsync = createAsyncThunk(
    'todolist/fetch',
    async (_, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
        try{
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

const createTodolistAsync = createAsyncThunk<
    TodolistType, // то что возвращает
    {title: string}, // то что принимает
    {rejectValue: {errors: string[]}} // тип возвращаемой ошибки
    >(
    'todolist/create',
    async (arg, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
        try{
            const response = await todolistApi.createTodolist(arg.title)
            if(response.data.resultCode === enums.ResponseCode.Ok){
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}))
                return response.data.data.item
            }else{
                handleServerAppError(response.data, dispatch)
                return rejectWithValue({errors: response.data.messages})
            }
        }catch(err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return rejectWithValue({errors: [error.message]})
        }
    }
)

const updateTodolistTitleAsync = createAsyncThunk<
    {todolistId: string, title: string}, // то что возвращает
    {todolistId: string, title: string}, // то что принимает
    {rejectValue: {errors: string[]}} // тип возвращаемой ошибки
    >(
    'todolist/updateTitle',
    async (arg, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
        dispatch(setEntityStatus({id: arg.todolistId, entityStatus: enums.StatusRequest.loading}))
        try{
            const response = await  todolistApi.updateTodolistTitle(arg.todolistId, arg.title)
            if(response.data.resultCode === enums.ResponseCode.Ok){
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}))
                dispatch(setEntityStatus({id: arg.todolistId, entityStatus: enums.StatusRequest.succeeded}))
                return{...arg}
            }else{
                dispatch(setAppStatusRequest({status: enums.StatusRequest.failed}))
                // handleServerAppError(response.data, dispatch)
                dispatch(setEntityStatus({id: arg.todolistId, entityStatus: enums.StatusRequest.failed}))
                return rejectWithValue({errors: response.data.messages})
            }
        }catch (err){
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return rejectWithValue({errors: [error.message]})
        }
    }
)

const removeTodolistAsync = createAsyncThunk(
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

export const todolistAsyncActions = {
    fetchTodolistAsync,
    updateTodolistTitleAsync,
    createTodolistAsync,
    removeTodolistAsync
}

export const slice = createSlice({
    name: 'todolist',
    initialState: [] as TodolistDomainType[],
    reducers:{
        changeTodolistFilter: (state, action: PayloadAction<{todolistId: string, filterValue: enums.FilterValues}>) => {
            const todolist = state.find(item => item.id === action.payload.todolistId)
            if(todolist) todolist.filter = action.payload.filterValue
        },
        setEntityStatus: (state, action: PayloadAction<{id: string, entityStatus: enums.StatusRequest}>) => {
            const todolist = state.find(item => item.id === action.payload.id)
            if(todolist) todolist.entityStatus = action.payload.entityStatus
        },
    },
    extraReducers: (builder)=> {
        builder
        .addCase(fetchTodolistAsync.fulfilled, (state, action)=>{
            return action.payload.todolists.map(item => ({...item, filter: enums.FilterValues.all, entityStatus: enums.StatusRequest.idle}))
        })
        .addCase(updateTodolistTitleAsync.fulfilled, (state, action) => {
              const todolist = state.find(item => item.id === action.payload?.todolistId)
              if(todolist) todolist.title = action.payload.title
        })
        .addCase(createTodolistAsync.fulfilled, (state, action) => {
            state.unshift({...action.payload, filter: enums.FilterValues.all, entityStatus: enums.StatusRequest.idle})

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
    filter: enums.FilterValues
    entityStatus: enums.StatusRequest
}
