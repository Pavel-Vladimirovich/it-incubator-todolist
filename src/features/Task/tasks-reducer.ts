import {AppDispatch, AppRootState} from "../../app/store";
import {createTodolist, removeTodolist, setTodolist} from "../Todolist/todolist-reducer";
import {TaskPriority, TaskStatus, TaskType, todolistApi, UpdateTaskModelType} from "../../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";
import {setAppError, setAppStatusRequest, StatusRequest} from "../../app/app_reducer";
import {createAsyncThunk, createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AxiosError} from "axios";


const initialState: TasksStateType = {}

export const fetchTasksAsync = createAsyncThunk(
    'tasks/fetch', (todolistId: string, {dispatch}) => {
        dispatch(setAppStatusRequest({status: StatusRequest.loading}))
        return todolistApi.getTasks(todolistId)
            .then((response) => {
                if (response.status === 200) {
                    dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
                    return {todolistId, tasks: response.data.items}
                } else {
                    dispatch(setAppError({error: response.data.error}))
                    dispatch(setAppStatusRequest({status: StatusRequest.failed}))
                }

            })
            .catch(error => {
                handleServerNetworkError(error, dispatch)
            })

    })

export const createTaskAsync = createAsyncThunk(
    'tasks',
    async (arg: { todolistId: string, title: string }, {dispatch}) => {
        try {
            dispatch(setAppStatusRequest({status: StatusRequest.loading}))
            const response = await todolistApi.createTask(arg.todolistId, arg.title)
            if (response.data.resultCode === 0) {
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
            if (response.data.resultCode === 0) {
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
export const updateTaskAsync = createAsyncThunk<any,
    { todolistId: string; taskId: string; domainModel: domainTaskModelType },
    { state: AppRootState}>( // в slice пока нет обработчика
    'task/update',
    async (arg:{ todolistId: string, taskId: string, domainModel: domainTaskModelType } , {dispatch, getState}) => {

        const state = getState()
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
            if (response.data.resultCode === 0) {
                 return {...arg};
                dispatch(setAppStatusRequest({status: StatusRequest.succeeded}));
                dispatch(setStatusTask({...arg, status: TaskStatus.Completed}));
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
        updateTask: (state, action: PayloadAction<{ todolistId: string, taskId: string, domainModel: domainTaskModelType }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1)
                tasks[index] = {...tasks[index], ...action.payload.domainModel}
        },
        setStatusTask: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: TaskStatus }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index].status = action.payload.status
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(removeTodolist, (state, action) => {
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
export const {updateTask, setStatusTask} = slice.actions

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

// export const _fetchTasksAsync = (todolistId: string) => {
//     return (dispatch: AppDispatch) => {
//         dispatch(setAppStatusRequest({status: StatusRequest.loading}))
//         todolistApi.getTasks(todolistId)
//             .then((response) => {
//                 if (response.status === 200) {
//                     dispatch(setTasks({todolistId, tasks: response.data.items}))
//                     dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
//                 } else {
//                     dispatch(setAppError({error: response.data.error}))
//                     dispatch(setAppStatusRequest({status: StatusRequest.failed}))
//                 }
//
//             })
//             .catch(error => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }
// }

// export const _removeTaskAsync = (todolistId: string, taskId: string) => {
// return (dispatch: AppDispatch) => {
//     dispatch(setAppStatusRequest({status: StatusRequest.loading}))
//     dispatch(setStatusTask({todolistId, taskId, status: TaskStatus.InProgress}))
//     todolistApi.removeTask(todolistId, taskId)
//         .then((response) => {
//             if (response.data.resultCode === 0) {
//                 dispatch(removeTask({todolistId, taskId}))
//                 dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
//             } else {
//                 handleServerAppError(response.data, dispatch)
//             }
//         })
//         .catch(error => {
//             handleServerNetworkError(error, dispatch)
//         })
// }

// export const _createTaskAsync = (todolistId: string, title: string) => {
//     return (dispatch: AppDispatch) => {
//         dispatch(setAppStatusRequest({status: StatusRequest.loading}))
//         todolistApi.createTask(todolistId, title)
//             .then((response) => {
//                 if (response.data.resultCode === 0) {
//                     dispatch(createTask({task: response.data.data.item}))
//                     dispatch(setAppStatusRequest({status: StatusRequest.succeeded}))
//                 } else {
//                     handleServerAppError(response.data, dispatch)
//                 }
//             })
//             .catch(error => {
//                 handleServerNetworkError(error, dispatch)
//             })
//     }
//
// }

type domainTaskModelType = {
    title?: string
    description?: string
    status?: TaskStatus
    priority?: TaskPriority
    startDate?: string
    deadline?: string
}


export const _updateTaskAsync = (todolistId: string, taskId: string, domainModel: domainTaskModelType) => {
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
        todolistApi.updateTask(todolistId, taskId, modelApi)
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
