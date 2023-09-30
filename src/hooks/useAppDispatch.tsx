import {useDispatch} from "react-redux";
import {AppRootDispatch} from "../app/store";
import {ActionCreatorsMapObject, bindActionCreators} from "redux";
import {useMemo} from "react";

export const useAppDispatch = () => useDispatch<AppRootDispatch>()

export function useDispatchedActions<T extends ActionCreatorsMapObject<any>>(actions: T) {
    const dispatch = useAppDispatch()

    return useMemo(() => {
        return bindActionCreators(actions, dispatch)
    }, [actions, dispatch])
}
