import {IconButton, TextField, Tooltip} from "@material-ui/core";
import React, {ChangeEvent, useEffect, useState} from "react";
import style from "./EditableSpan.module.scss";
import EditIcon from "@material-ui/icons/Edit";

type EditableSpanPropsType = {
    newTitle: string
    setNewTitle: (value: string) => void
    title: string;
    toggleEditMode: boolean;
    activateEditMode: () => void;
    deactivateActivateEditMode: () => void;
};
export const EditableSpan = ({title, toggleEditMode, activateEditMode, deactivateActivateEditMode, newTitle, setNewTitle}: EditableSpanPropsType) => {
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
                    onBlur={deactivateActivateEditMode}
                    autoFocus
                />
            ) : (
                <span onDoubleClick={activateEditMode}>{title}</span>
            )}
        </>
    );
};
