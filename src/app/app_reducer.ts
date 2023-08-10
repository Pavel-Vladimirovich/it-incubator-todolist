export enum StatusRequest {
    idle = "idle",
    loading = "loading",
    succeeded = "succeeded",
    failed = " failed"
}

const initialState = {
    error: null as string | null,
    status: StatusRequest.idle as StatusRequest,
    isAuthorized: false as boolean
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
            isAuthorized: action.payloadType
        }
        default:
            return state
    }
}


// actions
export const setAppError = (error: string | null) => ({type: "APP/SET_ERROR", payloadType: error} as const)
export const setAppStatusRequest = (status: StatusRequest) => ({type: "APP/SET_STATUS", payloadType: status} as const)
export const appAuthorized = (isAuthorized: boolean) => ({type: "APP/IS_AUTHORIZED", payloadType: isAuthorized} as const)

// types
type InitialStateType = typeof initialState

export type ErrorActionType = ReturnType<typeof setAppError>
export type StatusRequestActionType = ReturnType<typeof setAppStatusRequest>
export type IsAuthorizedType = ReturnType<typeof appAuthorized>

type ActionType =
    | ErrorActionType
    | StatusRequestActionType
    | IsAuthorizedType