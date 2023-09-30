import {createAsyncThunk} from "@reduxjs/toolkit";
import {setAppError, setAppStatusRequest} from "../../app/app_reducer";
import {enums} from "../../enums";
import {TaskPriority, TaskStatus, todolistApi, UpdateTaskModelType} from "../../api/todolist-api";
import {AxiosError, HttpStatusCode} from "axios";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {AppRootState} from "../../app/store";
import {setStatusTask} from "./tasks-reducer";

export const fetchTasksAsync = createAsyncThunk(
    'tasks/fetch',
    async (todolistId: string, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
        try{
            const response = await todolistApi.getTasks(todolistId)
            if (response.status === HttpStatusCode.Ok) {
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}))
                return {todolistId, tasks: response.data.items}
            } else {
                dispatch(setAppError({error: response.data.error}))
                dispatch(setAppStatusRequest({status: enums.StatusRequest.failed}))
                return rejectWithValue('some error')
            }
        }
        catch(err) {
            const error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return rejectWithValue('some error')
        }
    })

export const createTaskAsync = createAsyncThunk(
    'tasks',
    async (arg: { todolistId: string, title: string }, {dispatch, rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}))
        try {
            const response = await todolistApi.createTask(arg.todolistId, arg.title)
            if (response.data.resultCode === enums.ResponseCode.Ok) {
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}))
                return {task: response.data.data.item}
            } else {
                handleServerAppError(response.data, dispatch)
                return rejectWithValue('some error')
            }

        } catch (err) {
            const error = err as AxiosError // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch)
            return rejectWithValue('some error')
        }
    })

export const removeTaskAsync = createAsyncThunk(
    'tasks/removeTask',
    async (arg: { todolistId: string, taskId: string }, {dispatch,rejectWithValue}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}));
        dispatch(setStatusTask({...arg, status: TaskStatus.InProgress}));
        try {
            const response = await todolistApi.removeTask(arg.todolistId, arg.taskId);
            if (response.data.resultCode === enums.ResponseCode.Ok) {
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}));
                return arg;
            } else {
                handleServerAppError(response.data, dispatch);
                return rejectWithValue('some error')
            }
        } catch (err) {
            const error = err as AxiosError; // необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch);
            return rejectWithValue('some error')
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

export const updateTaskAsync = createAsyncThunk(
    'task/update',
    async (arg:{ todolistId: string, taskId: string, domainModel: domainTaskModelType } , {dispatch, rejectWithValue ,getState}) => {
        dispatch(setAppStatusRequest({status: enums.StatusRequest.loading}));
        dispatch(setStatusTask({...arg, status: TaskStatus.InProgress}));

        const state = getState() as AppRootState
        const task = state.tasks[arg.todolistId].find(ts => ts.id === arg.taskId);

        if (!task) {
            return rejectWithValue('some error')
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

        try {
            const response = await todolistApi.updateTask(arg.todolistId, arg.taskId, modelApi);
            if (response.data.resultCode === enums.ResponseCode.Ok) {
                dispatch(setAppStatusRequest({status: enums.StatusRequest.succeeded}));
                dispatch(setStatusTask({...arg, status: TaskStatus.Completed}));
                return arg;
            }else{
                handleServerAppError(response.data, dispatch)
                return rejectWithValue('some error')
            }
        } catch (err) {
            let error = err as AxiosError;// необходимо типизировать т.к. ругается на тип unknown
            handleServerNetworkError(error, dispatch);
            return rejectWithValue('some error')
        }
    }
)