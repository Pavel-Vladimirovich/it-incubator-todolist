import React, {ChangeEvent, useState} from "react";
import  style from "./EditableSpan.module.scss";

type EditableSpanPropsType = {
    title: string
    onChangeTitle: (title: string) => void
    className?: string
}
export const EditableSpan = ({title, onChangeTitle, className}: EditableSpanPropsType) => {

    const [editMode, setEditMode] = useState<boolean>(false);
    const [newTitle, setNewTitle] = useState('')

    const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNewTitle(event.currentTarget.value)
    }
    const activateEditMode = () => {
        setEditMode(true)
        setNewTitle(title)
    }
    const deactivateActivateEditMode = () => {
        setEditMode(false)
        onChangeTitle(newTitle)
    }

    return (
        <>
            {editMode ?
                <textarea className={style.input}  value={newTitle}  onChange={onChangeHandler} onBlur={deactivateActivateEditMode} autoFocus/> :
                <span onDoubleClick={activateEditMode}>{title}</span>}
        </>
    )
}