import { IconButton, TextField, Tooltip } from "@material-ui/core";
import React, { ChangeEvent, useEffect, useState } from "react";
import style from "./EditableSpan.module.scss";
import EditIcon from "@material-ui/icons/Edit";

type EditableSpanPropsType = {
  newTitle: string
  title: string;
  onChangeTitle: (title: string) => void;
  toggleEditMode?: boolean;
  activateEditMode?: () => void;
  deactivateActivateEditMode?: () => void;
};
export const EditableSpan = ({
  title,
  onChangeTitle,
  toggleEditMode,
  activateEditMode,
  deactivateActivateEditMode,newTitle
}: EditableSpanPropsType) => {

  //const [editMode, setEditMode] = useState<boolean>(false);
  //const [newTitle, setNewTitle] = useState("");

  const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    //setNewTitle(event.currentTarget.value);
  };
  const activateEditMode1 = () => {
    //setEditMode(true);
    //setNewTitle(title);
  };
  const deactivateActivateEditMode1 = () => {
    //setEditMode(false);
    //onChangeTitle(newTitle);
  };

  return (
    <div className={style.item}>
      {toggleEditMode ? (
        <TextField
          id="standard-multiline-flexible"
          multiline
          maxRows={5}
          value={newTitle}
          onChange={onChangeHandler}
          onBlur={deactivateActivateEditMode}
          autoFocus
          className={style.input}
        />
      ) : (
        <span onDoubleClick={activateEditMode}>{title}</span>
      )}
      {/* <Tooltip title="Edit">
        <IconButton onClick={activateEditMode} color="primary" size="small">
          <EditIcon color="primary" />
        </IconButton>
      </Tooltip> */}
    </div>
  );
};
