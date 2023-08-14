import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import thunk from "redux-thunk";
import {appReducer} from "./app_reducer";
import {todolistReducer} from "../features/Todolist/todolist-reducer";
import {tasksReducer} from "../features/Task/tasks-reducer";
import {authReducer} from "./auth_reducer";


const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
    app: appReducer,
    authData: authReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

//types
export type AppRootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

//export type AppThunk <ReturnType = void> = ThunkAction<ReturnType, AppRootState, unknown, ActionApp>

//@ts-ignore
window.store = store