
import React, {ChangeEvent, KeyboardEvent, useState} from "react";
import style from "./AddItemForm.module.scss";

type AddItemFormType = {
    addItem: (title: string) => void
}

export const AddItemForm = ({addItem}: AddItemFormType) => {
    let [title, setTitle] = useState("");

    let [error, setError] = useState<string | null>(null);

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
            setError("field cannot be empty");
            return;
        }
        if (title.length > 20) {
            setError("Task name cannot be more than 20 letters");
            return;
        }
        addItem(title.trim());
        setTitle("");
    };
    return (
        <div className={style.todolist_input}>
            {error ? (<h3 className={style.error_message}>{error}</h3>) : ''}
            <input
                value={title}
                className={`${style.input} ${error ? style.error : ""}`}
                onChange={onChangeHandler}
                onKeyDown={onKeyPressHandler}
            />
            <button
                className={`${style.btn} ${style.btn_input}`}
                onClick={addTasksHandler}>add
            </button>
        </div>
    )
}