import {authAPI} from "../api/todolist-api";
import {handleServerAppError, handleServerNetworkError} from "../utils/error-utils";
import {currentAuthData, login} from "./auth_reducer";
import {AppDispatch} from "./store";

export enum StatusRequest {
    idle = "idle",
    loading = "loading",
    succeeded = "succeeded",
    failed = " failed"
}

const initialState = {
    error: null as string | null,
    status: StatusRequest.idle as StatusRequest,
    isInitialization: false as boolean
}

export const appReducer = (state: InitialStateType = initialState, action: ActionType): InitialStateType => {
    switch (action.type) {
        case "APP/SET_ERROR":
            return {
                ...state,
                error: action.payloadType
            }
        case "APP/SET_STATUS":
            return {
                ...state,
                status: action.payloadType
            }
        case "APP/IS_AUTHORIZED": 
        return {
            ...state,
            isInitialization: action.payloadType
        }
        default:
            return state
    }
}


// actions
export const setAppError = (error: string | null) => ({type: "APP/SET_ERROR", payloadType: error} as const)
export const setAppStatusRequest = (status: StatusRequest) => ({type: "APP/SET_STATUS", payloadType: status} as const)
export const setAppInitialization = (isAuthorized: boolean) => ({type: "APP/IS_AUTHORIZED", payloadType: isAuthorized} as const)

// thunks
export const appInitializationAsync = () => (dispatch: AppDispatch) => {
    authAPI.getAuthData()
        .then(response => {
            if(response.data.resultCode === 0){
                dispatch(login(true))
                dispatch(currentAuthData(response.data.data))
            }else{
                handleServerAppError(response.data, dispatch)
            }
            dispatch(setAppInitialization(true))
        })
        .catch(error => {
            handleServerNetworkError(error, dispatch)
        })
}

// types
type InitialStateType = typeof initialState

type ErrorActionType = ReturnType<typeof setAppError>
type StatusRequestActionType = ReturnType<typeof setAppStatusRequest>
type IsAuthorizedType = ReturnType<typeof setAppInitialization>

type ActionType =
    | ErrorActionType
    | StatusRequestActionType
    | IsAuthorizedType