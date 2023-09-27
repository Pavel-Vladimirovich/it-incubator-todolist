import {AppRootState} from "./store";

export const selectIsInitialized = (state: AppRootState): boolean => (state.app.isInitialization)