import {TextField, Tooltip} from "@material-ui/core";
import React, {ChangeEvent, useState} from "react";
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
    TextField: {
        width: "100%"
    }
})

type PropsType = {
    title: string;
    onClisk: (title: string) => void;
};
export const EditableTitleTodolist = React.memo(({title, onClisk}: PropsType) => {
    const classes = useStyles();

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
		onClisk(newTitle)
	}

    return (
        <>
            {toggleEditMode ? (
                <TextField
                    className={classes.TextField}
                    id="standard-multiline-flexible"
                    multiline
                    value={newTitle}
                    onChange={onChangeHandler}
                    onBlur={deactivateEditMode}
                    autoFocus
                />
            ) : (
                <Tooltip title="Edit" placement={"top"}>
                    <span style={{cursor: "pointer"}} onDoubleClick={activateEditMode}>{title}</span>
                </Tooltip>
            )}
        </>
    );
});
