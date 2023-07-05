import {applyMiddleware, combineReducers, legacy_createStore as createStore} from "redux";
import {todolistReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";
import thunk from "redux-thunk";



export type AppStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));

//@ts-ignore
window.store = store