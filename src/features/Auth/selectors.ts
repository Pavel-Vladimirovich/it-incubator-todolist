import {AppRootState} from "../../app/store";

export const selectIsLoggedIn = (state: AppRootState) => (state.authData.isLoggedIn)