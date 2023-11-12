import {taskAsyncActions, slice} from './tasks-reducer'
import {Task} from './Task'


const taskActions = {
    ...taskAsyncActions,
    ...slice.actions,
}

export {
    taskActions,
    Task
}