import {AppRootState} from "../../app/store";
import {TodolistDomainType} from "../Todolist/todolist-reducer";


export const selectTodolists = (state: AppRootState) : TodolistDomainType[] => (state.todolists)