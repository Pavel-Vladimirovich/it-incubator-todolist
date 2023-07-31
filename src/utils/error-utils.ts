import {setAppError, setAppStatusRequest, StatusRequest} from "../app/app_reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if(data.messages.length){
        dispatch(setAppError(data.messages[0]))
    }else{
        dispatch(setAppError("some error occurred"))
    }
    dispatch(setAppStatusRequest(StatusRequest.failed))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {
    dispatch(setAppError(error.message ? error.message : "some error occurred"))
    dispatch(setAppStatusRequest(StatusRequest.failed))
}