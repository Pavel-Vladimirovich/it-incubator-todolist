import {AppRootState} from "./store";
import {enums} from "../enums";

export const isInitialization = (state: AppRootState): boolean => (state.app.isInitialization)
export const status = (state: AppRootState):enums.StatusRequest => (state.app.status)
export const error = (state: AppRootState): null | string => (state.app.error)
