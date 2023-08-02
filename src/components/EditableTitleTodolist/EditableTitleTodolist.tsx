import {TextField} from "@material-ui/core";
import React, {ChangeEvent, useState} from "react";
import { useDispatch } from "react-redux";
import { toggleTodolistEditMode, updateTodolistTitleAsync } from "../../features/Todolist/todolist-reducer";


type PropsType = {
	id: string;
    title: string;
	toggleEditMode: boolean;
};
export const EditableTitleTodolist = React.memo(({id, title, toggleEditMode}: PropsType) => {
    console.log('render editable title todo')
	const dispatch = useDispatch<any>()

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
		dispatch(updateTodolistTitleAsync(id, newTitle))
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
                <span style={{cursor: "pointer", width: "100%", border:'1px solid red'}} onDoubleClick={activateEditMode}>{title}</span>
            )}
        </>
    );
});
