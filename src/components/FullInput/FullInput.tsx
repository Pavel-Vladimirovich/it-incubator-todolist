import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import s from "./FullInput.module.scss";




type InputPropsType = {
    addMessage: (titles: string) => void;
}

export const FullInput = (props: InputPropsType) => {


    let [title, setTitle] = useState('');

    function onChangeInputHandler(event: ChangeEvent<HTMLInputElement>) {
        setTitle(event.currentTarget.value);
    }


    function onChangeButtonHandler() {
        props.addMessage(title);
        setTitle('');
    }

    const onChangeKeyboardHandler = (keyPress: KeyboardEvent<HTMLInputElement>) => {
        if (keyPress.keyCode == 13) {
            props.addMessage(title);
            setTitle('');
        }
    };

    return (
        <div className={s.container}>
            <form action="#">
                <input value={title} onChange={onChangeInputHandler} onKeyDown={onChangeKeyboardHandler} />
                <input onClick={onChangeButtonHandler} type="button" value="send" />
            </form>

        </div>
    );
}