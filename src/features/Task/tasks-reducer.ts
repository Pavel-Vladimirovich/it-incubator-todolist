import {AppDispatch, AppRootState} from "../../app/store";
import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from "../Todolist/todolist-reducer";
import {TaskPriority, TaskStatus, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import {setAppError, setAppStatusRequest, StatusRequest} from "../../app/app_reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: TasksStateType = {}


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers:{
        createTask: (state, action: PayloadAction<{task: TaskType}>) => {
            const task: TaskType = {...action.payload.task};
            state = {
                [task.todoListId]: [task, ...state[task.todoListId]]
            }
            
        },
        removeTask: (state, action: PayloadAction<{todolistId: string, taskId: string}>) => {
            const todolistTasks = state[action.payload.todolistId]
            [action.payload.todolistId]: todolistTasks.filter((t) => t.id !== action.payload.taskId)
        }
    }
})

export const tasksReducer1 = slice.reducer
export const {createTask} = slice.actions

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        // case "CREATE-TASK": {
        //     const task: TaskType = {...action.task};
        //     return {
        //         ...state,
        //         [task.todoListId]: [task, ...state[task.todoListId]]
        //     }
        // }
        case "REMOVE-TASK": {
            const todolistTasks = state[action.todolistId]
            return {
                ...state,
                [action.todolistId]: todolistTasks.filter((t) => t.id !== action.taskId)
            }
        }
        case "UPDATE-TASK": {
            const todolistTasks = state[action.todolistId];
            const updatedTasks = todolistTasks.map((task) =>
                task.id === action.taskId ? {...task, ...action.domainModel} : task
            );
            return {
                ...state,
                [action.todolistId]: updatedTasks,
            };
        }
        case "CREATE_TODOLIST": {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case "REMOVE_TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }
        case "SET_TODOLISTS": {
            const stateCopy = {...state}
            action.todolists.forEach(tl => {
                stateCopy[tl.id] = []
            })
            return stateCopy
        }
        case "SET-TASKS": {
            const stateCopy = {...state}
            const task = action.tasks.map(t => {
                return {
                    ...t,
                    editMode: false
                }
            })
            stateCopy[action.todolistId] = task
            return stateCopy
        }

        default:
            return state;
    }
};
// actions
// export const createTask = (task: TaskType) => ({type: "CREATE-TASK", task} as const)
export const removeTask = (todolistId: string, taskId: string) => ({type: "REMOVE-TASK", todolistId, taskId} as const)
export const updateTask = (todolistId: string, taskId: string, domainModel: domainTaskModelType) => ({
    type: "UPDATE-TASK",
    todolistId,
    taskId,
    domainModel
} as const)
export const setTasks = (todolistId: string, tasks: Array<TaskType>) => ({
    type: "SET-TASKS",
    todolistId,
    tasks
} as const)

// thunks
export const fetchTasksAsync = (todolistId: string) => {
    return (dispatch: AppDispatch) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        todolistAPI.getTasks(todolistId)
            .then((response) => {
                if(response.status === 200){
                    dispatch(setTasks(todolistId, response.data.items))
                    dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                }else{
                    dispatch(setAppError({error: response.data.error}))
                    dispatch(setAppStatusRequest({status: StatusRequest.failed}))
                }
                
            })
            .catch(error=>{
                handleServerNetworkError(error, dispatch) 
            })
    }
}

export const removeTaskAsync = (todolistId: string, taskId: string) => {
    return (dispatch: AppDispatch) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        //need to disable button -->
        todolistAPI.removeTask(todolistId, taskId)
            .then((response) => {
                if(response.data.resultCode === 0){
                    dispatch(removeTask(todolistId, taskId))
                    dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                }else{
                    handleServerAppError(response.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }

}
export const createTaskAsync = (todolistId: string, title: string) => {
    return (dispatch: AppDispatch) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        todolistAPI.createTask(todolistId, title)
            .then((response) => {
                if(response.data.resultCode === 0){
                    dispatch(createTask({task: response.data.data.item}))
                    dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                }else{
                    handleServerAppError(response.data, dispatch)
                }
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }

}
type domainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    startDate?: string
    deadline?: string
}


export const updateTaskAsync = (todolistId: string, taskId: string, domainModel: domainTaskModelType) => {
    return (dispatch: AppDispatch, getState: () => AppRootState) => {
        const state = getState()
        const task = state.tasks[todolistId].find(ts => ts.id === taskId)
        if (!task) {
            console.warn('task not found')
            return
        }
        const modelApi: UpdateTaskModelType = {
            title: task.title,
            description: task.description,
            status: task.status,
            priority: task.priority,
            startDate: task.startDate,
            deadline: task.deadline,
            ...domainModel
        }
        todolistAPI.updateTask(todolistId, taskId, modelApi)
            .then((response) => {
                dispatch(updateTask(todolistId, taskId, domainModel))
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })
    }

}
// types

export type TasksStateType = {
    [key: string]: Array<TaskType>;
};

type ActionType =
    | ReturnType<typeof updateTask>
    | ReturnType<typeof removeTask>
    | ReturnType<typeof createTask>
    | ReturnType<typeof setTasks>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
