import React, {ChangeEvent, KeyboardEvent, useState, useReducer} from "react";
import style from "./AddItemForm.module.scss";
import {Button, Grid, Snackbar, TextField} from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import MuiAlert, {AlertProps} from '@material-ui/lab/Alert';

const TEXT_ERROR_MESSAGE = "Field can't be empty"
const REMOVE_TEXT_ERROR = "REMOVE-TEXT-ERROR";
const ERROR_FIELD_IS_EMPTY = "ERROR-FIELD-IS-EMPTY";
const ERROR = "ERROR";
const REMOVE_ERROR = "REMOVE_ERROR";
const CURRENT_TARGET_VALUE = "CURRENT_TARGET_VALUE";

type AddItemFormPropsType = {
    addItem: (title: string) => void;
    textMessage: string
    labelMessage: string
};

type ActionType = {
    type: string;
    titleText?: string;
};

type StateType = {
    error: boolean
    errorMessage: string;
    title: string;
};

function Alert(props: AlertProps) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
}


const reducer = (state: StateType, action: ActionType): StateType => {
    switch (action.type) {
        case ERROR:
            return {
                ...state,
                error: true
            };
        case REMOVE_ERROR:
            return {
                ...state,
                error: false
            }
        case REMOVE_TEXT_ERROR:
            return {
                ...state,
                errorMessage: (state.errorMessage = ""),
            };
        case ERROR_FIELD_IS_EMPTY:
            return {
                ...state,
                errorMessage: (state.errorMessage = TEXT_ERROR_MESSAGE),
            };
        case CURRENT_TARGET_VALUE:
            if (action.titleText) {
                return {
                    ...state,
                    title: (state.title = action.titleText),
                };
            } else {
                return {
                    ...state,
                    title: (state.title = ""),
                };
            }
        default:
            throw new Error("Bad action type");
    }
};


export const AddItemForm = React.memo(({addItem, textMessage, labelMessage}: AddItemFormPropsType) => {
    console.log('render item form')
    const [state, dispatch] = useReducer(reducer, {error: false, errorMessage: "", title: ""});
    const [open, setOpen] = useState(false);

    const handleClick = () => {
        setOpen(true);
    };

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }

        setOpen(false);
    };
    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        dispatch({
            type: CURRENT_TARGET_VALUE,
            titleText: event.currentTarget.value,
        });
    };

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        dispatch({type: REMOVE_TEXT_ERROR});
        if (event.key === "Enter") {
            addTasksHandler();
        }
    };

    const addTasksHandler = () => {
        if (state.title.trim() === "") {
            dispatch({type: ERROR_FIELD_IS_EMPTY});
            dispatch({type: ERROR})
            handleClick();
            return;
        }
        addItem(state.title.trim());
        dispatch({type: REMOVE_TEXT_ERROR});
        dispatch({type: REMOVE_ERROR})
        dispatch({type: CURRENT_TARGET_VALUE});
        handleClick();
    };
    return (
        <form
            noValidate
            autoComplete="off"
            className={`${style.text_field} ${style.text_field_floating_2}`}
        >
            <Grid container>
                <Grid item xs={12} sm={10}>
                    <TextField
                        style={{width: "100%"}}
                        error={!!state.errorMessage}
                        variant="outlined"
                        id="standard-multiline-flexible"
                        multiline
                        maxRows={4}
                        label={state.errorMessage ? state.errorMessage : labelMessage}
                        value={state.title}
                        onChange={onChangeHandler}
                        onKeyDown={onKeyPressHandler}
                    />
                </Grid>
                <Grid item xs={12} sm={2}>
                    <Button
                        startIcon={<AddBoxIcon/>}
                        style={{marginLeft: "5px", width: "100%", height: "100%"}}
                        color="primary"
                        variant="contained"
                        className={`${style.btn} ${style.btn_input}`}
                        onClick={addTasksHandler}>
                        create
                    </Button>
                </Grid>
            </Grid>
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert onClose={handleClose} severity={!!state.error ? "error" : "success"}>
                    {!!state.error ? TEXT_ERROR_MESSAGE : textMessage}
                </Alert>
            </Snackbar>
        </form>
    );
})

