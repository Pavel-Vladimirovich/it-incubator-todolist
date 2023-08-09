import {authAPI, AuthDataType, AuthorizeDataType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import { setAppStatusRequest, StatusRequest, StatusRequestActionType } from "./app_reducer";


const initialState: AuthDataType = {
    id: null,
    login: "",
    email: "",
    isLoggedIn: false
}

export const authReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case "AUTH_DATA":
            return {
                ...state,
                ...action.authData
            }
        case "login/IS_LOGGED_IN":
        return {
            ...state,
            isLoggedIn: action.isLoggedIn
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

const setAuthDataSuccess = (isLoggedIn: boolean) => ({
    type: "login/IS_LOGGED_IN",
    isLoggedIn
}as const)

// thunks
export const getAuthDataAsync = () => (dispatch: Dispatch) => {
    authAPI.getAuthenticatorData()
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

export const loginAsync = (data: AuthorizeDataType) => (dispatch: Dispatch<ActionType | StatusRequestActionType>) => {
    dispatch(setAppStatusRequest(StatusRequest.loading))
    authAPI.setAuthenticatorData(data)
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(setAuthDataSuccess(true))
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