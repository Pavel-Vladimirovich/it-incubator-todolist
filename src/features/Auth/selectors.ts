import {AppRootState} from "../../app/store";

export const isLoggedIn = (state: AppRootState) => (state.authData.isLoggedIn)
export const login = (state: AppRootState) => (state.authData.login)