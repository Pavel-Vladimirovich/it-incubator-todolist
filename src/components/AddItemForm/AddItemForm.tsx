import React, {ChangeEvent, KeyboardEvent, useState, useReducer} from "react";
import style from "./AddItemForm.module.scss";
import { v4 as uuidv4 } from 'uuid';
import {Button, TextField} from "@material-ui/core";
import AddBoxIcon from '@material-ui/icons/AddBox';

type AddItemFormType = {
    addItem: (title: string) => void;
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


const AddItemForm = ({addItem}: AddItemFormType) => {

    const [state, dispatch] = useReducer(reducer, {error: '', title: ''});

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({type: CURRENT_TARGET_VALUE, titleText: event.currentTarget.value})
    };

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        dispatch({type: TOGGLE_ERROR});
        if (event.key === "Enter") {
            addTasksHandler();
        }
    };

    const addTasksHandler = () => {
        if (state.title.trim() === "") {
            dispatch({type: ERROR_FIELD_IS_EMPTY});
            return;
        }
        addItem(state.title.trim());
        dispatch({type: CURRENT_TARGET_VALUE})
    };
    return (
        <form noValidate autoComplete="off" className={`${style.text_field} ${style.text_field_floating_2}`}>
            <TextField 
                style={{width: '100%'}}
                error={!!state.error}
                variant="outlined"
                id="standard-multiline-flexible" 
                multiline
                maxRows={4}
                label={ state.error ? state.error : "Add a new to-do list..."} 
                value={state.title}
                onChange={onChangeHandler}
                onKeyDown={onKeyPressHandler}/>
            <Button
                startIcon={<AddBoxIcon/>}
                style={{marginLeft: '5px'}}
                color="primary"
                variant="contained"
                className={`${style.btn} ${style.btn_input}`}
                onClick={addTasksHandler}>
               create
            </Button>
        </form>
    );
};

export default React.memo(AddItemForm);