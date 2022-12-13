
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import { ClassElement } from "typescript";
import s from "./FullInput.module.scss";


type titleType = {
    addTitleMessge: (title: string) => void
}


export const FullInput = (props: titleType) => {

    let [title, setTitle] = useState('')

    const onHundlerChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
    }
    
    
    function onHundlerSendMessageButton(event: any) {
        if (event.keyCode == '13') {
            props.addTitleMessge(title);
            setTitle('');
        }
    }


    const onHundlerSendMessage = () => {
        props.addTitleMessge(title);
        setTitle('');
    }

    return (
        <div className={s.container}>
            <input value={title} onChange={onHundlerChangeMessage} onKeyDown={onHundlerSendMessageButton} />
            <button onClick={onHundlerSendMessage}>send meesage</button>
        </div>
    )
}