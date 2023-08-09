import {AuthDataType, AuthorizeModelType, todolistAPI} from "../api/todolist-api";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import { setAppStatusRequest, StatusRequest, StatusRequestActionType } from "./app_reducer";


const initialState: AuthDataType = {
    id: null,
    login: "",
    email: "",
    authDataSuccess: false
}

export const authReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case "AUTH_DATA":
            return {
                ...state,
                ...action.authData
            }
        case "AUTH_SUCCESS": 
        return {
            ...state,
            authDataSuccess: action.authDataSuccess
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

const setAuthDataSuccess = () => ({
    type: "AUTH_SUCCESS",
    authDataSuccess: true
}as const)

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

export const setAuthenticatorDataAsync = (model: AuthorizeModelType) => (dispatch: Dispatch<ActionType | StatusRequestActionType>) => {
    dispatch(setAppStatusRequest(StatusRequest.loading))
    todolistAPI.setAuthenticatorData(model)
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(setAuthDataSuccess())
                dispatch(setAppStatusRequest(StatusRequest.succeeded))
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setAppStatusRequest(StatusRequest.failed))
            }
        })
}

// types
type InitialStateType = typeof initialState
type ActionType = 
| ReturnType<typeof authData>
| ReturnType<typeof setAuthDataSuccess>