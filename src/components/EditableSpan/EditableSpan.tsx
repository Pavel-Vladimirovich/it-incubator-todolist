import { Button, IconButton, TextField, Tooltip } from "@material-ui/core";
import EditIcon from "@material-ui/icons/Edit";
import React, { ChangeEvent, useState } from "react";
import style from "./EditableSpan.module.scss";

type EditableSpanPropsType = {
  title: string;
  onChangeTitle: (title: string) => void;
  className?: string;
};
export const EditableSpan = ({
  title,
  onChangeTitle,
  className,
}: EditableSpanPropsType) => {
  const [editMode, setEditMode] = useState<boolean>(false);
  const [newTitle, setNewTitle] = useState("");

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
    <div className={style.container}>
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
      <div className={` ${style.m_left}`}>
        <Tooltip title="Edit">
          <IconButton
            onClick={() => {
              activateEditMode();
            }}
            color="primary"
            size="small"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      </div>
    </div>
  );
};
