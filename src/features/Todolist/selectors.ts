import {AppRootState} from "../../app/store";

export const tasksForTodolist = (todolistId: string) => {
    return (state: AppRootState) => (state.tasks[todolistId])
}