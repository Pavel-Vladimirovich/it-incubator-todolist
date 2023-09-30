import * as todolistSelectors from './selectors'
import * as todolistAsyncActions from './todolist-actions'
// import {slice} from './todolist-reducer' как Димыч через slice достать actions
import {changeTodolistFilter,setEntityStatus} from './todolist-reducer' // или как я

const todolistActions = {
    ...todolistAsyncActions,
    changeTodolistFilter,
    setEntityStatus
}


export {
    todolistSelectors,
    todolistActions,
}