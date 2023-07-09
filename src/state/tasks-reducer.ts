import {AddTodolistActionType, RemoveTodolistActionType, SetTodolistActionType} from "./todolist-reducer";
import {TaskPriority, TaskStatus, TaskType, todolistsAPI, UpdateTaskModelType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {AppStateType} from "./store";


const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "CREATE-TASK": {
            const task: TaskDomainType = {...action.task, editMode: false};
            return {
                ...state,
                [task.todoListId]: [task, ...state[task.todoListId]]
            }
        }
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
        case "TOGGLE-TASK-EDIT-MODE": {
            const todolistTasks = state[action.todolistId];
            const updatedTasks = todolistTasks.map((task) =>
                task.id === action.taskId ? {...task, editMode: action.editMode} : task
            );
            return {
                ...state,
                [action.todolistId]: updatedTasks,
            };
        }

        case "CREATE-TODOLIST": {
            return {
                ...state,
                [action.todolist.id]: []
            }
        }
        case "REMOVE-TODOLIST": {
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }
        case "SET-TODOLISTS": {
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
export const createTaskAC = (task: TaskType) => ({type: "CREATE-TASK", task} as const)
export const removeTaskAC = (todolistId: string, taskId: string) => ({type: "REMOVE-TASK", todolistId, taskId} as const)


export const updateTaskAC = (todolistId: string, taskId: string, domainModel: domainTaskModelType) => ({
    type: "UPDATE-TASK",
    todolistId,
    taskId,
    domainModel
} as const)

export const toggleTaskEditModeAC = (todolistId: string, taskId: string, editMode: boolean) => ({
    type: "TOGGLE-TASK-EDIT-MODE",
    todolistId,
    taskId,
    editMode
} as const)

export const setTasksAC = (todolistId: string, tasks: Array<TaskType>) => ({
    type: "SET-TASKS",
    todolistId,
    tasks
} as const)

// thunks
export const fetchTasksTC = (todolistId: string) => {
    return (dispatch: Dispatch<ActionType>) => {
        todolistsAPI.getTasks(todolistId)
            .then((response) => {
                dispatch(setTasksAC(todolistId, response.data.items))
            })
    }
}

export const removeTaskTC = (todolistId: string, taskId: string) => {
    return (dispatch: Dispatch<ActionType>) => {
        todolistsAPI.removeTask(todolistId, taskId)
            .then((response) => {
                dispatch(removeTaskAC(todolistId, taskId))
            })
    }

}
export const createTaskTC = (todolistId: string, title: string) => {
    return (dispatch: Dispatch<ActionType>) => {
        todolistsAPI.createTask(todolistId, title)
            .then((response) => {
                dispatch(createTaskAC(response.data.data.item))
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


export const updateTaskTC = (todolistId: string, taskId: string, domainModel: domainTaskModelType) => {
    return (dispatch: Dispatch<ActionType>, getState: () => AppStateType) => {
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
        todolistsAPI.updateTask(todolistId, taskId, modelApi)
            .then((response) => {
                dispatch(updateTaskAC(todolistId, taskId, domainModel))
            })
    }

}
// types
export type TaskDomainType = TaskType & { editMode: boolean }

export type TasksStateType = {
    [key: string]: Array<TaskDomainType>;
};

export type ActionType =
    | ReturnType<typeof updateTaskAC>
    | ReturnType<typeof removeTaskAC>
    | ReturnType<typeof createTaskAC>
    | ReturnType<typeof toggleTaskEditModeAC>
    | ReturnType<typeof setTasksAC>
    | AddTodolistActionType
    | RemoveTodolistActionType
    | SetTodolistActionType
