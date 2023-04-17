import {TextField } from "@material-ui/core";
import React, {ChangeEvent, useEffect, useState} from "react";
import style from "./EditableSpan.module.scss";

type EditableSpanPropsType = {
  title: string;
  onChangeTitle: (title: string) => void;
  toggleEditMode?: boolean
};
export const EditableSpan = ({title, onChangeTitle, toggleEditMode}: EditableSpanPropsType) => {

  const [editMode, setEditMode] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");

  useEffect(() => {
    if(toggleEditMode)
    setEditMode(toggleEditMode)
  }, [])


  const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setNewTitle(event.currentTarget.value);
  };
  const activateEditMode = () => {
    setEditMode(true);
    setNewTitle(title);
  };
  const deactivateActivateEditMode = () => {
    setEditMode(false);
    onChangeTitle(newTitle);
  };

  return (
      <div className={style.item}>
        {editMode ? (
          <TextField
            id="standard-multiline-flexible"
            multiline
            maxRows={5}
            className={style.input}
            value={newTitle}
            onChange={onChangeHandler}
            onBlur={deactivateActivateEditMode}
            autoFocus
          />
        ) : (
          <span onDoubleClick={activateEditMode}>{title}</span>
        )}
      </div>
  );
};
