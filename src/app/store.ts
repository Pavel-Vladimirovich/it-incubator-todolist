import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import thunk from "redux-thunk";
import { tasksReducer } from "../features/Task/tasks-reducer";
import { todolistReducer } from "../features/Todolist/todolist-reducer";
import { appReducer } from "./app_reducer";
import { authReducer } from "../features/Auth/auth_reducer";


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


//@ts-ignore
window.store = store