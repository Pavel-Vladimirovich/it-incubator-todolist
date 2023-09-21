import {useDispatch} from "react-redux";
import {AppRootDispatch} from "../app/store";

export const useAppDispatch = () => useDispatch<AppRootDispatch>()