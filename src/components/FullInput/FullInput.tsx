
import React, { ChangeEvent, KeyboardEvent, useState } from "react";
import s from "./FullInput.module.scss";


type titleType = {
    addTitleMessge: (title: string) => void
}


export const FullInput = (props: titleType) => {

    let [title, setTitle] = useState('')

    const onHundlerChangeMessage = (event: ChangeEvent<HTMLInputElement>) =>{
            setTitle(event.currentTarget.value);
    }
    const onHundlerSendMessage = () =>{
        props.addTitleMessge(title);
        setTitle('');
    }

    return (
        <div className={s.container}>
            <input value={title} onChange={onHundlerChangeMessage}/>
            <button onClick={onHundlerSendMessage}>send meesage</button>
        </div>
    )
}