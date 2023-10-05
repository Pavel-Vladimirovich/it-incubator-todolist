import * as appSelectors from './selectors'
import {appAsyncActions, slice} from './app_reducer'

const appActions = {
    ...appAsyncActions,
    ...slice.actions
}

export {
    appActions,
    appSelectors
}