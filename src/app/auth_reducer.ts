import {authAPI, AuthDataType, LoginDataType} from "../api/todolist-api";
import {Dispatch} from "redux";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import { appAuthorized, setAppStatusRequest, StatusRequest, StatusRequestActionType } from "./app_reducer";


const initialState: InitialStateType = {
    id: null,
    login: "",
    email: "",
    isLoggedIn: false,
}

export const authReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case "LOGIN/AUTH_DATA":
            return {
                ...state,
                ...action.authData
            }
        case "LOGIN/IS_LOGGED_IN":
        return {
            ...state,
            isLoggedIn: action.isLoggedIn
        }    
        default:
            return state
    }
}


// actions
const currentAuthData = (authData: AuthDataType) => ({
        type: "LOGIN/AUTH_DATA",
        authData
} as const)

const login = (isLoggedIn: boolean) => ({
    type: "LOGIN/IS_LOGGED_IN",
    isLoggedIn
}as const)

// thunks
export const getCurrentAuthDataAsync = () => (dispatch: Dispatch) => {
    authAPI.getAuthData()
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(currentAuthData(response.data.data))
                dispatch(appAuthorized(true))
            }else{
                handleServerAppError(response.data, dispatch)
                dispatch(appAuthorized(false))
            }
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
            dispatch(appAuthorized(false))
        })
}

export const loginAsync = (data: LoginDataType) => (dispatch: Dispatch<ActionType | StatusRequestActionType>) => {
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
}

// types
type InitialStateType = CurrentAutDataType
export type CurrentAutDataType = AuthDataType & 
{   
    isLoggedIn: boolean,
}

type ActionType = 
| ReturnType<typeof currentAuthData>
| ReturnType<typeof login>