import {TextField} from "@material-ui/core";
import React, {ChangeEvent, useState} from "react";
import {useDispatch} from "react-redux";
import {updateTodolistTitleAsync} from "../../features/Todolist/todolist-reducer";
import {StatusRequest} from "../../app/app_reducer";


type PropsType = {
	id: string;
    title: string;
	entityStatus: StatusRequest
};
export const EditableTitleTodolist = React.memo(({id, title, entityStatus}: PropsType) => {
	const dispatch = useDispatch<any>()
	const [newTitle, setNewTitle] = useState<string>('');
	const [toggleEditMode, setToggleEditMode] = useState<boolean>(false)

    const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNewTitle(event.currentTarget.value);
    };
	const activateEditMode = () => {
		setToggleEditMode(true)
		setNewTitle(title)
	}
	const deactivateEditMode = () => {
		setToggleEditMode(false)
		dispatch(updateTodolistTitleAsync(id, newTitle)) //!!! для переиспользования вынести за пределы компоненты
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
                <span style={{cursor: entityStatus === StatusRequest.loading ? "wait" : "pointer", width: "100%", border:'1px solid red'}} onDoubleClick={activateEditMode}>{title}</span>
            )}
        </>
    );
});
