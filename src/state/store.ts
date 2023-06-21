import {combineReducers, legacy_createStore as createStore} from "redux";
import {todolistReducer} from "./todolist-reducer";
import {tasksReducer} from "./tasks-reducer";


export type AppStateType = ReturnType<typeof rootReducer>

const rootReducer = combineReducers({
    todolists: todolistReducer,
    tasks: tasksReducer,
});

export const store = createStore(rootReducer);