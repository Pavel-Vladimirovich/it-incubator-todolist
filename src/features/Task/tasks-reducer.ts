import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AxiosError, HttpStatusCode } from "axios";
import { TaskPriority, TaskStatus, TaskType, todolistApi, UpdateTaskModelType } from "../../api/todolist-api";
import { setAppError, setAppStatusRequest, StatusRequest } from "../../app/app_reducer";
import { AppRootState } from "../../app/store";
import { ResultCode } from "../../enums/ResultCode";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import { createTodolistAsync, fetchTodolistAsync, removeTodolistAsync } from "../Todolist/todolist-reducer";



const initialState: TasksStateType = {}

export const fetchTasksAsync = createAsyncThunk(
    'tasks/fetch',
     async (todolistId: string, {dispatch}) => {
         dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        try{
            const response = await todolistApi.getTasks(todolistId)
            if (response.status === HttpStatusCode.Ok) {
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                return {todolistId, tasks: response.data.items}
            } else {
                dispatch(setAppError({error: response.data.error}))
                dispatch(setAppStatusRequest({status: StatusRequest.failed}))
            }
        }
        catch(err) {
            const error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
        }
    })

export const createTaskAsync = createAsyncThunk(
    'tasks',
    async (arg: { todolistId: string, title: string }, {dispatch}) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        try {
            const response = await todolistApi.createTask(arg.todolistId, arg.title)
            if (response.data.resultCode === ResultCode.Ok) {
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                return {task: response.data.data.item}
            } else {
                handleServerAppError(response.data, dispatch)
            }

        } catch (err) {
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
        }
    })

export const removeTaskAsync = createAsyncThunk(
    'tasks/removeTask',
    async (arg: { todolistId: string, taskId: string }, {dispatch}) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}));
        dispatch(setStatusTask({...arg, status: TaskStatus.InProgress}));
        try {
            const response = await todolistApi.removeTask(arg.todolistId, arg.taskId);
            if (response.data.resultCode === ResultCode.Ok) {
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}));
                return {todolistId: arg.todolistId, taskId: arg.taskId};
            } else {
                handleServerAppError(response.data, dispatch);
            }
        } catch (err) {
            const error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch);
        }

    })

    type domainTaskModelType = { // необходимо для отправки на сервер
        title?: string
        description?: string
        status?: TaskStatus
        priority?: TaskPriority
        startDate?: string
        deadline?: string
    }
    
export const updateTaskAsync = createAsyncThunk<any, // выяснить вопрос типизации параметров
    { todolistId: string; taskId: string; domainModel: domainTaskModelType },
    { state: AppRootState}>(
    'task/update',
    async (arg:{ todolistId: string, taskId: string, domainModel: domainTaskModelType } , {dispatch, getState}) => {

        const state: AppRootState = getState()
        const task = state.tasks[arg.todolistId].find(ts => ts.id === arg.taskId);
        if (!task) {
            console.warn('task not found');
            return
        }
        const modelApi: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...arg.domainModel
        };
        dispatch(setAppStatusRequest({status: StatusRequest.loading}));
        dispatch(setStatusTask({...arg, status: TaskStatus.InProgress}));
        try {
            const response = await todolistApi.updateTask(arg.todolistId, arg.taskId, modelApi);
            if (response.data.resultCode === ResultCode.Ok) {
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}));
                dispatch(setStatusTask({...arg, status: TaskStatus.Completed}));
                 return {...arg};
                
            }
        } catch (err) {
            let error = err as AxiosError;// необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch);
        }
    }
)

const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        // самостоятельное решение изминения состояния таски, не факт, что правильно
        setStatusTask: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: TaskStatus }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index].status = action.payload.status
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(removeTodolistAsync.fulfilled, (state, action) => {
                if(action.payload)
                delete state[action.payload.todolistId]
            })
            .addCase(createTodolistAsync.fulfilled, (state, action) => {
                if(action.payload)
                state[action.payload.id] = []
            })
            // получение тудулистов
            .addCase(fetchTodolistAsync.fulfilled, (state, action) => {
                if(action.payload)
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(fetchTasksAsync.fulfilled, (state, action) => {
                if (action.payload)
                    state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(createTaskAsync.fulfilled, (state, action) => {
                if (action.payload)
                    state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(removeTaskAsync.fulfilled, (state, action) => {
                if (action.payload) {
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                    if (index !== -1) tasks.splice(index, 1)
                }
            })
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                if(action.payload){
                    const tasks = state[action.payload.todolistId]
                    const index = tasks.findIndex(t => t.id === action.payload.taskId)
                    if (index !== -1)
                        tasks[index] = {...tasks[index], ...action.payload.domainModel}
                }

            })
    }
})

export const tasksReducer = slice.reducer
export const { setStatusTask} = slice.actions


// types

export type TasksStateType = {
    [key: string]: Array<TaskType>;
};

