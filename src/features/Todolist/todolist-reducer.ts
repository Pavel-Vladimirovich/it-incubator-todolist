import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {TodolistType} from "../../api/todolist-api";
import {enums} from "../../enums";
import {
    createTodolistAsync,
    fetchTodolistAsync,
    removeTodolistAsync,
    updateTodolistTitleAsync
} from "./todolist-actions";


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
