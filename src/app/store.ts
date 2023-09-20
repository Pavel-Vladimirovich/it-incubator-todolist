import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import thunk from "redux-thunk";
import logger from 'redux-logger';
import {appReducer} from "./app_reducer";
import {todolistReducer} from "../features/Todolist/todolist-reducer";
import {tasksReducer} from "../features/Task/tasks-reducer";
import {authReducer} from "./auth_reducer";
import { configureStore } from "@reduxjs/toolkit";
import {useDispatch} from "react-redux";


const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    authData: authReducer,
});

// export const store = createStore(rootReducer, applyMiddleware(thunk));

export const store = configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .prepend(thunk)
      // .concat(logger)
    
})

//types
export type AppRootState = ReturnType<typeof store.getState>
export type AppRootDispatch = typeof store.dispatch

export const useAppDispatch = () => useDispatch<AppRootDispatch>()

//@ts-ignore
window.store = store