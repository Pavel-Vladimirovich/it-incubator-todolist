
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import s from "./FullInput.module.scss";


type titleType = {
    addTitleMessge: (title: string) => void
}


export const FullInput = (props: titleType) => {

    let [title, setTitle] = useState('');

    const onHandlerChangeMessage = (event: ChangeEvent<HTMLInputElement>) => {
        setTitle(event.currentTarget.value);
    }
    
    
    function onHandlerSendMessageButton(event: any){
        if (event.keyCode === '13') {
            props.addTitleMessge(title);
            setTitle('');
        }
    }


    const onHandlerSendMessage = () => {
        props.addTitleMessge(title);
        setTitle('');
    }

    return (
        <div className={s.container}>
            <input value={title} onChange={onHandlerChangeMessage} onKeyDown={onHandlerSendMessageButton} />
            <button onClick={onHandlerSendMessage}>send meesage</button>
        </div>
    )
}