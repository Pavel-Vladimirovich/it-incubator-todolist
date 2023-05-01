import {v1} from "uuid";
import {AddTodolistActionType, RemoveTodolistActionType} from "./todolists-reducer";

type TaskType = {
    id: string;
    title: string;
    isDone: boolean;
    editMode: boolean;
};

export type TasksStateType = {
    [key: string]: Array<TaskType>;
};

type ChangeTaskTitleActionType = ReturnType<typeof changeTaskTitleAC>
type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
type AddTaskActionType = ReturnType<typeof addTaskAC>
type ChangeTaskStatusActionType = ReturnType<typeof changeTaskStatusAC>
type ToggleTaskEditModeActionType = ReturnType<typeof toggleTaskEditModeAC>

type ActionType = ChangeTaskTitleActionType
    | RemoveTaskActionType
    | AddTaskActionType
    | ChangeTaskStatusActionType
    | AddTodolistActionType
    | RemoveTodolistActionType
    | ToggleTaskEditModeActionType

export const tasksReducer = (state: TasksStateType, action: ActionType): TasksStateType => {
    switch (action.type) {
        case "ADD-TASK": {
            const task = {id: v1(), title: action.title, isDone: false, editMode: false};
            return {
                ...state,
                [action.todolistId]: [task, ...state[action.todolistId]]
            }
        }
        case "REMOVE-TASK": {
            const todolistTasks = state[action.todolistId]
            return {
                ...state,
                [action.todolistId]: todolistTasks.filter((t) => t.id !== action.taskId)
            }
        }
        case "CHANGE-TASK-STATUS": {
            const todolistTasks = state[action.todolistId]
            return {
                ...state,
                [action.todolistId]: todolistTasks.map(task =>
                    task.id === action.taskId ? {...task, isDone: action.isDone} : task)
            }
        }
        case "CHANGE-TITLE-TASK": {
            const todolistTasks = state[action.todolistId];
            const updatedTasks = todolistTasks.map((task) =>
                task.id === action.taskId ? {...task, title: action.title} : task
            );
            return {
                ...state,
                [action.todolistId]: updatedTasks,
            };
        }
        case "TOGGLE-TASK-EDIT-MODE":{
            const todolistTasks = state[action.todolistId];
            const updatedTasks = todolistTasks.map((task) =>
                task.id === action.taskId ? {...task, editMode: action.editMode} : task
            );
            return {
                ...state,
                [action.todolistId]: updatedTasks,
            };
        }

        case "ADD-TODOLIST":{
            return {
                ...state,
                [action.todolistId]: []
            }
        }
        case 'REMOVE-TODOLIST':{
            const stateCopy = {...state}
            delete stateCopy[action.todolistId]
            return stateCopy
        }

        default:
            return {...state}
    }
};

export const addTaskAC = (todolistId: string, title: string) => ({
    type: "ADD-TASK",
    todolistId,
    title
} as const)

export const removeTaskAC = (todolistId: string, taskId: string) => ({
    type: "REMOVE-TASK",
    todolistId: todolistId,
    taskId: taskId
} as const)

export const changeTaskStatusAC = (todolistId: string, taskId: string, isDone: boolean) => ({
    type: "CHANGE-TASK-STATUS",
    todolistId,
    taskId,
    isDone
} as const)

export const changeTaskTitleAC = (todolistId: string, taskId: string, title: string) => ({
    type: "CHANGE-TITLE-TASK",
    todolistId: todolistId,
    taskId: taskId,
    title: title
} as const)

export const toggleTaskEditModeAC = (todolistId: string, taskId: string, editMode: boolean) => ({
    type: "TOGGLE-TASK-EDIT-MODE",
    todolistId,
    taskId,
    editMode
} as const)

