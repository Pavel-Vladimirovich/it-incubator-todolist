import * as todolistSelectors from './selectors'
import {Todolist} from './Todolist'
import {todolistAsyncActions, slice} from './todolist-reducer'

const todolistActions = {
    ...todolistAsyncActions,
    ...slice.actions,
}

export {
    todolistSelectors,
    todolistActions,
    Todolist
}