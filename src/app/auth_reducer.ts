import {authAPI, AuthDataType, LoginDataType} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import { setAppStatusRequest, StatusRequest } from "./app_reducer";
import {AppDispatch} from "./store";


const initialState: InitialStateType = {
    id: null,
    login: "",
    email: "",
    isLoggedIn: false,
}

export const authReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case "AUTH/AUTH_DATA":
            return {
                ...state,
                ...action.authData
            }
        case "AUTH/IS_LOGGED_IN":
        return {
            ...state,
            isLoggedIn: action.isLoggedIn
        }    
        default:
            return state
    }
}


// actions
export const currentAuthData = (authData: AuthDataType) => ({
        type: "AUTH/AUTH_DATA",
        authData
} as const)

export const login = (isLoggedIn: boolean) => ({
    type: "AUTH/IS_LOGGED_IN",
    isLoggedIn
}as const)

// thunks
export const loginAsync = (data: LoginDataType) => (dispatch: AppDispatch) => {
    dispatch(setAppStatusRequest(StatusRequest.loading))
    authAPI.login(data)
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(login(true))
                dispatch(setAppStatusRequest(StatusRequest.succeeded))
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setAppStatusRequest(StatusRequest.failed))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

export const logoutAsync = () => (dispatch: AppDispatch) => {
    dispatch(setAppStatusRequest(StatusRequest.loading))
    authAPI.logout()
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(login(false))
                dispatch(setAppStatusRequest(StatusRequest.succeeded))
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(setAppStatusRequest(StatusRequest.failed))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
type InitialStateType = CurrentAutDataType
type CurrentAutDataType = AuthDataType & {isLoggedIn: boolean}
type LoginActionType = ReturnType<typeof login>
type CurrentAuthDataType = ReturnType<typeof currentAuthData>

type ActionType = 
| LoginActionType
| CurrentAuthDataType