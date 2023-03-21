import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import style from "./AddItemForm.module.scss";
import { v1 } from "uuid";

type AddItemFormType = {
    addItem: (title: string) => void
}

export const AddItemForm = ({addItem}: AddItemFormType) => {
    const [title, setTitle] = useState("");

    const [error, setError] = useState<string | null>(null);

    const onChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
    };
    const onKeyPressHandler = (event: KeyboardEvent<HTMLInputElement>) => {
        setError(null);
        if (event.key === "Enter") {
            addTasksHandler();
            setTitle("");
        }
    };

    const addTasksHandler = () => {
        if (title.trim() === "") {
            setError("Field can't be empty");
            return;
        }
        if (title.length > 15) {
            setError("No more than 10 letters");
            return;
        }
        addItem(title.trim());
        setTitle("");
    };
    const htmlForm = v1();
    return (
        <div className={`${style.text_field} ${style.text_field_floating_2}`}>
            {/*{error ? (<span className={style.error_message}>{error}</span>) : ''}*/}
            <input
                id={htmlForm}
                placeholder='Enter text'
                value={title}
                className={`${style.text_field__input} ${error ? style.error : ""}`}
                onChange={onChangeHandler}
                onKeyDown={onKeyPressHandler}
            />
            <label htmlFor={htmlForm} className={`${style.text_field__label} ${error ? style.error : ""}`}>{error ? `${error}` : 'Enter text'}</label>
            <button
                className={`${style.btn} ${style.btn_input}`}
                onClick={addTasksHandler}>add
            </button>
        </div>
    )
}
