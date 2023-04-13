import React, {ChangeEvent, KeyboardEvent, useState, useReducer} from "react";
import style from "./AddItemForm.module.scss";
import { v4 as uuidv4 } from 'uuid';

type AddItemFormType = {
    addItem: (title: string) => void;
    placeholderText?: string;
};

type ActionType = {
    type: string;
    titleText?: string
};

type StateType = {
    error: string
    title: string
};


const TOGGLE_ERROR = "TOGGLE-ERROR";
const ERROR_FIELD_IS_EMPTY = "ERROR-FIELD-IS-EMPTY";
const ERROR_LETTERS_MORE_THAN = "ERROR-LETTERS-MORE-THAN";
const CURRENT_TARGET_VALUE = "CURRENT_TARGET_VALUE"

const reducer = (state: StateType, action: ActionType): StateType => {

    switch (action.type) {
        case TOGGLE_ERROR:
            return {
                ...state,
                error: state.error = ""
            };
        case ERROR_FIELD_IS_EMPTY:
            return {
                ...state,
                error: state.error = "Field can't be empty"
            };
        case ERROR_LETTERS_MORE_THAN:
            return {
                ...state,
                error: state.error = "No more than 15 letters",
            };
        case CURRENT_TARGET_VALUE:
            if (action.titleText) {
                return {
                    ...state,
                    title: state.title = action.titleText
                };
            } else {
                return {
                    ...state,
                    title: state.title = ''
                }
            }
        default:
            throw new Error("Bad action type");
    }
};


const AddItemForm = ({addItem, placeholderText}: AddItemFormType) => {

    const [state, dispatch] = useReducer(reducer, {error: '', title: ''});

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({type: CURRENT_TARGET_VALUE, titleText: event.currentTarget.value})
    };

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        dispatch({type: TOGGLE_ERROR});
        if (event.key === "Enter") {
            addTasksHandler();
            dispatch({type: CURRENT_TARGET_VALUE})
        }
    };

    const addTasksHandler = () => {
        if (state.title.trim() === "") {
            dispatch({type: ERROR_FIELD_IS_EMPTY});
            return;
        }
        if (state.title.length > 15) {
            dispatch({type: ERROR_LETTERS_MORE_THAN});
            return;
        }
        addItem(state.title.trim());
        dispatch({type: CURRENT_TARGET_VALUE})
    };
    const htmlForm = uuidv4();
    return (
        <div className={`${style.text_field} ${style.text_field_floating_2}`}>
            <input
                id={htmlForm}
                placeholder={placeholderText}
                value={state.title}
                className={`${style.text_field__input} ${
                    state.error ? style.error : ""
                }`}
                onChange={onChangeHandler}
                onKeyDown={onKeyPressHandler}
            />
            <label
                htmlFor={htmlForm}
                className={`${style.text_field__label} ${
                    state.error ? style.error : ""
                }`}
            >
                {state.error ? `${state.error}` : `${placeholderText}`}
            </label>
            <button
                className={`${style.btn} ${style.btn_input}`}
                onClick={addTasksHandler}
            >
                add
            </button>
        </div>
    );
};

export default React.memo(AddItemForm);