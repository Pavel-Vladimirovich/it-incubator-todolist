import {setAppError, setAppStatusRequest} from "../app/app_reducer";
import {Dispatch} from "redux";
import {ResponseType} from "../api/todolist-api.js";
import {enums} from "../enums";

export const handleServerAppError = <D>(data: ResponseType<D>, dispatch: Dispatch) => {
    if(data.messages.length){
        dispatch(setAppError({error: data.messages[0]}))
    }else{
        dispatch(setAppError({error: "some error occurred"}))
    }
    dispatch(setAppStatusRequest({status: enums.StatusRequest.failed}))
}

export const handleServerNetworkError = (error: {message: string}, dispatch: Dispatch) => {
    dispatch(setAppError(error.message ? {error: error.message} : {error: "some error occurred"}))
    dispatch(setAppStatusRequest({status: enums.StatusRequest.failed}))
}