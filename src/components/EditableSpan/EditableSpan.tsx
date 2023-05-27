import {TextField} from "@material-ui/core";
import React, {ChangeEvent} from "react";


type EditableSpanPropsType = {
    newTitle: string
    setNewTitle: (value: string) => void
    title: string;
    toggleEditMode: boolean;
    activateEditMode: () => void;
    deactivateEditMode: () => void;
};
export const EditableSpan = React.memo(({title, toggleEditMode, activateEditMode, deactivateEditMode, newTitle, setNewTitle}: EditableSpanPropsType) => {
    console.log('render editable span')
    const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNewTitle(event.currentTarget.value);
    };
    return (
        <>
            {toggleEditMode ? (
                <TextField
                    style={{width:"100%" }}
                    id="standard-multiline-flexible"
                    multiline
                    maxRows={5}
                    value={newTitle}
                    onChange={onChangeHandler}
                    onBlur={deactivateEditMode}
                    autoFocus
                />
            ) : (
                <span onDoubleClick={activateEditMode}>{title}</span>
            )}
        </>
    );
});
