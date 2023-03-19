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
        <div className={style.input_wrapper}>
            {/*{error ? (<span className={style.error_message}>{error}</span>) : ''}*/}
            <input
                placeholder={`${error ? `${error}` : '' }`}
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