import React, { ChangeEvent } from 'react';

type InputType = {
    title: string,
    setTitle: (title: string) => void,
}

export const Input2 = (props: InputType) =>{
    function onChangeInputHandler(event: ChangeEvent<HTMLInputElement>) {
        props.setTitle(event.currentTarget.value)
    }

    return(
        <div>
            <input value={props.title} placeholder='input text' onChange={onChangeInputHandler} />
        </div>
    )
} 