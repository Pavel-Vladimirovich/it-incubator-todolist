import React, { ChangeEvent, KeyboardEvent, useState, useReducer } from "react";
import style from "./AddItemForm.module.scss";
import { v1 } from "uuid";
import { error } from "console";

type AddItemFormType = {
  addItem: (title: string) => void;
};

type ActionType = {
  type: string;
};

type StateType = {
  error: string;
};

const TOGGLE_ERROR = "TOGGLE-ERROR";
const ERROR_FIELD_IS_EMPTY = "ERROR-FIELD-IS-EMPTY";
const ERROR_LETTERS_MORE_THAN = "ERROR-LETTERS-MORE-THAN";

const reducer = (state: StateType, action: ActionType): StateType => {

  switch (action.type) {
    case TOGGLE_ERROR:
     return {
        ...state,
        error: state.error = ''
     };
    case ERROR_FIELD_IS_EMPTY:
      return {
        ...state,
        error: state.error = "Field can't be empty"
      };
    case ERROR_LETTERS_MORE_THAN:
      return{
        ...state,
        error: state.error = "No more than 15 letters"
      }
    default:
      throw new Error("Bad action type");
  }
};

export const AddItemForm = ({ addItem }: AddItemFormType) => {
  const [state, dispatch] = useReducer(reducer, { error: ""});

  const [title, setTitle] = useState("");

  // const [error, setError] = useState<string | null>(null);

  const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    setTitle(event.currentTarget.value);
  };
  const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
    dispatch({ type: TOGGLE_ERROR });
    if (event.key === "Enter") {
      addTasksHandler();
      setTitle("");
    }
  };

  const addTasksHandler = () => {
    if (title.trim() === "") {
      dispatch({ type: ERROR_FIELD_IS_EMPTY });
      return;
    }
    if (title.length > 15) {
      dispatch({ type: ERROR_LETTERS_MORE_THAN });
      return;
    }
    addItem(title.trim());
    setTitle("");
  };
  const htmlForm = v1();
  return (
    <div className={`${style.text_field} ${style.text_field_floating_2}`}>
      <input
        id={htmlForm}
        placeholder="Enter text"
        value={title}
        className={`${style.text_field__input} ${state.error ? style.error : ""}`}
        onChange={onChangeHandler}
        onKeyDown={onKeyPressHandler}
      />
      <label
        htmlFor={htmlForm}
        className={`${style.text_field__label} ${state.error ? style.error : ""}`}
      >
        {state.error ? `${state.error}` : "Enter text"}
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
