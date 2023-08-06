import {AuthDataType, todolistAPI} from "../api/todolist-api";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";


const initialState: AuthDataType = {
    id: null,
    login: "",
    email: ""
}

export const authReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case "AUTH_DATA":
            return {
                ...state,
                ...action.authData
            }
        default:
            return state
    }
}


// actions
const authData = (authData: AuthDataType) => ({
        type: "AUTH_DATA",
        authData
} as const)
// thunks
export const getAuthDataAsync = () => (dispatch: Dispatch) => {
    todolistAPI.getAuthenticatorData()
        .then(response => {
            if(response.status === 200){
                dispatch(authData(response.data.data))
            }else{
                handleServerAppError(response.data, dispatch)
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
type InitialStateType = typeof initialState
type ActionType = ReturnType<typeof authData>