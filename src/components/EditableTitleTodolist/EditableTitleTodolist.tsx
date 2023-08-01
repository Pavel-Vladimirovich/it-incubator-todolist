import {TextField} from "@material-ui/core";
import React, {ChangeEvent, useEffect, useState} from "react";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { AppStateType } from "../../app/store";
import { changeTodolistTitle, toggleTodolistEditMode } from "../../features/Todolist/todolist-reducer";


type PropsType = {
	id: string;
    title: string;
	toggleEditMode: boolean;
};
export const EditableTitleTodolist = React.memo(({id, title, toggleEditMode}: PropsType) => {
    //console.log('render editable span')
	const dispatch = useDispatch()

	const [newTitle, setNewTitle] = useState<string>('');

    const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNewTitle(event.currentTarget.value);
    };
	const activateEditMode = () => {
		dispatch(toggleTodolistEditMode(id, true))
		setNewTitle(title)
	}
	const deactivateEditMode = () => {
		dispatch(toggleTodolistEditMode(id, false))
		dispatch(changeTodolistTitle(id, newTitle))
	}

    return (
        <>
            {toggleEditMode ? (
                <TextField
                    style={{width:"100%"}}
                    id="standard-multiline-flexible"
                    multiline
                    value={newTitle}
                    onChange={onChangeHandler}
                    onBlur={deactivateEditMode}
                    autoFocus
                />
            ) : (
                <span style={{cursor: "pointer"}} onDoubleClick={activateEditMode}>{title}</span>
            )}
        </>
    );
});
