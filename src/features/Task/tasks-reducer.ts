import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TaskStatus, TaskType} from "../../api/todolist-api";
import {createTaskAsync, fetchTasksAsync, removeTaskAsync, updateTaskAsync} from "./tasks-actions";
import {todolistActions} from '../Todolist'

const slice = createSlice({
    name: 'tasks',
    initialState: {} as TasksStateType,
    reducers: {
        // самостоятельное решение изминения состояния таски, для дизейбла кнопок, не факт, что правильно
        setStatusTask: (state, action: PayloadAction<{ todolistId: string, taskId: string, status: TaskStatus }>) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            tasks[index].status = action.payload.status
        }

    },
    extraReducers: (builder) => {
        builder
            .addCase(todolistActions.fetchTodolistAsync.fulfilled, (state, action) => {
                action.payload.todolists.forEach(tl => {
                    state[tl.id] = []
                })
            })
            .addCase(todolistActions.createTodolistAsync.fulfilled, (state, action) => {
                state[action.payload.id] = []
            })
            .addCase(todolistActions.removeTodolistAsync.fulfilled, (state, action) => {
                delete state[action.payload.todolistId]
            })
            .addCase(fetchTasksAsync.fulfilled, (state, action) => {
                    state[action.payload.todolistId] = action.payload.tasks
            })
            .addCase(createTaskAsync.fulfilled, (state, action) => {
                    state[action.payload.task.todoListId].unshift(action.payload.task)
            })
            .addCase(removeTaskAsync.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload?.taskId)
                if (index !== -1) tasks.splice(index, 1)
            })
            .addCase(updateTaskAsync.fulfilled, (state, action) => {
                const tasks = state[action.payload.todolistId]
                const index = tasks.findIndex(t => t.id === action.payload.taskId)
                if (index !== -1)
                    tasks[index] = {...tasks[index], ...action.payload.domainModel}
            })
    }
})

export const tasksReducer = slice.reducer
export const { setStatusTask} = slice.actions


// types

export type TasksStateType = {
    [key: string]: Array<TaskType>;
};

