enum FilterValuesType {
	all = "all",
	completed = "completed",
	active = "active",
}

export type TodolistType = {
	id: string;
	title: string;
	filter: FilterValuesType;
  };


type StateType = Array<TodolistType>

 type RemoveTodolistActionType = {
	type:'REMOVE-TODOLIST'
	id: string
 }
 
 type ActionType = RemoveTodolistActionType

export const todolistReducer = (state: StateType, action: ActionType) => {
	switch (action.type) {
		case 'REMOVE-TODOLIST':
			return{
				...state,
				state:  state.filter(tl => tl.id !== action.id)
			}
		default:
			throw new Error("I don't understand this type")
	}
 }
 