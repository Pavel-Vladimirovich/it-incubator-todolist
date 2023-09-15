import {AppDispatch, AppRootState} from "../../app/store";
import {
    AddTodolistActionType,
    createTodolist, removeTodolist,
    RemoveTodolistActionType, setTodolist,
    SetTodolistActionType
} from "../Todolist/todolist-reducer";
import {TaskPriority, TaskStatus, TaskType, todolistAPI, UpdateTaskModelType} from "../../api/todolist-api";
import { handleServerAppError, handleServerNetworkError } from "../../utils/error-utils";
import {setAppError, setAppStatusRequest, StatusRequest} from "../../app/app_reducer";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";


const initialState: TasksStateType = {}


const slice = createSlice({
    name: 'tasks',
    initialState,
    reducers:{
        setTasks: (state, action: PayloadAction<{todolistId: string, tasks: Array<TaskType>}>) => {
            state[action.payload.todolistId] = action.payload.tasks
        },
        createTask: (state, action: PayloadAction<{task: TaskType}>) => {
            state[action.payload.task.todoListId].unshift(action.payload.task)
        },
        removeTask: (state, action: PayloadAction<{todolistId: string, taskId: string}>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if(index !== -1) tasks.splice(index, 1)
        },
        updateTask: (state, action: PayloadAction<{todolistId: string, taskId: string, domainModel: domainTaskModelType}>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if(index !== -1)
            tasks[index] = {...tasks[index], ...action.payload.domainModel}
        },
        setStatusTask: (state, action: PayloadAction<{todolistId: string, taskId: string, status: TaskStatus}>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index].status = action.payload.status
        } 
       
    },
    extraReducers:(builder) => {
        builder
            .addCase(removeTodolist,(state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(createTodolist, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(setTodolist, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })

            })
    }
})

export const tasksReducer = slice.reducer
export const {createTask, removeTask, updateTask, setTasks, setStatusTask} = slice.actions

// export const _tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
//     switch (action.type) {
//         case "CREATE-TASK": {
//             const task: TaskType = {...action.task};
//             return {
//                 ...state,
//                 [task.todoListId]: [task, ...state[task.todoListId]]
//             }
//         }
//         case "REMOVE-TASK": {
//             const todolistTasks = state[action.todolistId]
//             return {
//                 ...state,
//                 [action.todolistId]: todolistTasks.filter((t) => t.id !== action.taskId)
//             }
//         }
//         case "UPDATE-TASK": {
//             const todolistTasks = state[action.todolistId];
//             const updatedTasks = todolistTasks.map((task) =>
//                 task.id === action.taskId ? {...task, ...action.domainModel} : task
//             );
//             return {
//                 ...state,
//                 [action.todolistId]: updatedTasks,
//             };
//         }
//         case createTodolist.type: {
//             return {
//                 ...state,
//                 [action.payload.id]: []
//             }
//         }
//         case removeTodolist.type: {
//             const stateCopy = {...state}
//             delete stateCopy[action.payload.todolistId]
//             return stateCopy
//         }
//         case setTodolist.type: {
//             const stateCopy = {...state}
//             action.payload.todolists.forEach(tl => {
//                 stateCopy[tl.id] = []
//             })
//             return stateCopy
//         }
//         case "SET-TASKS": {
//             const stateCopy = {...state}
//             const task = action.tasks.map(t => {
//                 return {
//                     ...t,
//                     editMode: false
//                 }
//             })
//             stateCopy[action.todolistId] = task
//             return stateCopy
//         }
//
//         default:
//             return state;
//     }
// };

// actions
// export const createTask = (task: TaskType) => ({type: "CREATE-TASK", task} as const)
// export const removeTask = (todolistId: string, taskId: string) => ({type: "REMOVE-TASK", todolistId, taskId} as const)
// export const updateTask = (todolistId: string, taskId: string, domainModel: domainTaskModelType) => ({
//     type: "UPDATE-TASK",
//     todolistId,
//     taskId,
//     domainModel
// } as const)
// export const setTasks = (todolistId: string, tasks: Array<TaskType>) => ({
//     type: "SET-TASKS",
//     todolistId,
//     tasks
// } as const)

// thunks
export const fetchTasksAsync = (todolistId: string) => {
    return (dispatch: AppDispatch) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        todolistAPI.getTasks(todolistId)
            .then((response) => {
                if(response.status === 200){
                    dispatch(setTasks({todolistId, tasks: response.data.items}))
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
        dispatch(setStatusTask({todolistId, taskId, status: TaskStatus.InProgress}))
        todolistAPI.removeTask(todolistId, taskId)
            .then((response) => {
                if(response.data.resultCode === 0){
                    dispatch(removeTask({todolistId, taskId}))
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
                dispatch(updateTask({todolistId, taskId, domainModel}))
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

// type ActionType =
//     | ReturnType<typeof updateTask>
//     | ReturnType<typeof removeTask>
//     | ReturnType<typeof createTask>
//     | ReturnType<typeof setTasks>
//     | AddTodolistActionType
//     | RemoveTodolistActionType
//     | SetTodolistActionType
