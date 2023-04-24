type TaskType = {
  id: string;
  title: string;
  isDone: boolean;
  editMode: boolean;
};

export type TasksObjType = {
  [key: string]: Array<TaskType>;
};

type ChangeTitleTaskActionType = ReturnType<typeof changeTitleTaskAC>
type RemoveTaskActionType = ReturnType<typeof removeTaskAC>


type stateType = TasksObjType;
type ActionType = ChangeTitleTaskActionType | RemoveTaskActionType

export const tasksReducer = (state: stateType, action: ActionType) => {
  switch (action.type) {
    case "CHANGE-TITLE-TASK": { 
		const task = state[action.todolistId].find((t) => t.id === action.taskId);
		if (task)
		task.title = action.title
		return {
			...state,
		}
    }
	case "REMOVE-TASK": {
		state[action.todolistId] = state[action.todolistId].filter((t) => t.id !== action.taskId)
		return{
			...state,
		}
	}
  }
};

export const changeTitleTaskAC = (todolistId: string, taskId: string, title: string) => ({
	type: "CHANGE-TITLE-TASK",
	todolistId: todolistId,
	taskId: taskId,
	title: title
} as const)


export const removeTaskAC = (todolistId: string, taskId: string) => ({
	type: "REMOVE-TASK",
	todolistId: todolistId,
	taskId: taskId
}as const)