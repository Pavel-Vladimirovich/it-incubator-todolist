import React, { ChangeEvent, KeyboardEvent, useState, useReducer } from "react";
import { Button, Grid, Snackbar, TextField, Typography } from "@material-ui/core";
import AddBoxIcon from "@material-ui/icons/AddBox";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";


const REMOVE_TEXT_ERROR = "REMOVE-TEXT-ERROR";
const ERROR_FIELD_IS_EMPTY = "ERROR-FIELD-IS-EMPTY";
const ERROR = "ERROR";
const REMOVE_ERROR = "REMOVE_ERROR";
const CURRENT_TARGET_VALUE = "CURRENT_TARGET_VALUE";

type AddItemFormPropsType = {
  addItem: (title: string) => void;
  textMessage?: string;
  labelMessage?: string;
};

type ActionType = {
  type: string;
  titleText?: string;
};

type StateType = {
  error: boolean;
  errorMessage: string | undefined;
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
        error: true,
      };
    case REMOVE_ERROR:
      return {
        ...state,
        error: false,
      };
    case REMOVE_TEXT_ERROR:
      return {
        ...state,
        errorMessage:  "",
      };
    case ERROR_FIELD_IS_EMPTY:
      return {
        ...state,
        errorMessage: action.titleText,
      };
    case CURRENT_TARGET_VALUE:{
      if(action.titleText){
        return {
          ...state,
          title: action.titleText,
        };
      }else {
        return {
          ...state,
          title: ''
        }
      }

    }
    default:
      throw new Error("Bad action type");
  }
};

export const AddItemForm = React.memo(
  ({ addItem, textMessage, labelMessage }: AddItemFormPropsType) => {
    //console.log('render item form')
    const [state, dispatch] = useReducer(reducer, {
      error: false,
      errorMessage: "",
      title: "",
    });
    const [open, setOpen] = useState(false);

    const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
      if (reason === "clickaway") {
        return;
      }
      setOpen(false);
    };

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
      dispatch({ type: REMOVE_TEXT_ERROR });
      dispatch({ type: REMOVE_ERROR });
      dispatch({
        type: CURRENT_TARGET_VALUE,
        titleText: event.currentTarget.value,
      });
    };

    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
      dispatch({ type: REMOVE_TEXT_ERROR });
      if (event.key === "Enter") {
        addTasksHandler();
      }
    };
    
    const addTasksHandler = async () => {
      if (state.title.trim() === "") {
        dispatch({ type: ERROR_FIELD_IS_EMPTY });
        dispatch({ type: ERROR });
        // handleClick();
        // return;
      }
      try {
        await addItem(state.title.replace(/\s+/g, ' ').trim());
        dispatch({ type: REMOVE_TEXT_ERROR });
        dispatch({ type: REMOVE_ERROR });
        dispatch({ type: CURRENT_TARGET_VALUE, titleText: '' });
      }catch (error: any){
        dispatch({type: ERROR})
        error && dispatch({ type: ERROR_FIELD_IS_EMPTY, titleText: error.message })
      }

      // handleClick();
    };
    return (
      <form noValidate autoComplete="off" onSubmit={e=>{e.preventDefault()}}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={10}>
            <TextField
              fullWidth
              required
              error={state.error}
              id="standard-basic"
              label={state.errorMessage ? state.errorMessage : labelMessage}
              value={state.title}
              onChange={onChangeHandler}
              onKeyDown={onKeyPressHandler}
            />
          </Grid>
          <Grid item xs={12} sm={2}>
            <Button
              startIcon={<AddBoxIcon />}
              fullWidth
              style={{height: '100%'}}
              color="primary"
              variant="outlined"
              disableElevation
              onClick={addTasksHandler}
            >
              <Typography noWrap>
                create
              </Typography>
            </Button>
          </Grid>
        </Grid>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
          <Alert
            onClose={handleClose}
            severity={!!state.error ? "error" : "success"}>
            {/*<span>{!!state.error ? TEXT_ERROR_MESSAGE : textMessage}</span>*/}
          </Alert>
        </Snackbar>
      </form>
    );
  }
);
