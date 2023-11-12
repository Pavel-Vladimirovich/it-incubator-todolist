import * as authSelectors from './selectors'
import {authAsyncActions} from './auth_reducer'
import {Login} from "./Login";

const authActions = {
    ...authAsyncActions
}

export {
    authActions,
    authSelectors,
    Login
}