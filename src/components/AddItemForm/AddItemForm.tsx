import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import style from "./AddItemForm.module.scss";

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
            setError("enter text please");
            return;
        }
        if (title.length > 100) {
            setError("name cannot be more than 100 letters");
            return;
        }
        addItem(title.trim());
        setTitle("");
    };
    return (
        <div className={style.text_field}>
            {/*{error ? (<span className={style.error_message}>{error}</span>) : ''}*/}
            <input
                id='input'
                value={title}
                className={`${style.text_field__input} ${error ? style.error : ""}`}
                onChange={onChangeHandler}
                onKeyDown={onKeyPressHandler}
            />
            <label htmlFor='input' className={style.text_field__label}>enter text </label>
            <button
                className={`${style.btn} ${style.btn_input}`}
                onClick={addTasksHandler}>add
            </button>
        </div>
    )
}
//https://itchief.ru/html-and-css/styling-text-input#with-floating-label