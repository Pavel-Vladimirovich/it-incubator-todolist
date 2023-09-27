import { useSelector } from "react-redux";
import {useDispatch} from "react-redux";
import {AppRootDispatch, AppRootState} from "../app/store";

export const useAppDispatch = () => useDispatch<AppRootDispatch>()
export const useAppSelector = () => useSelector<AppRootState>(state => state)


