import {TextField, Tooltip} from "@material-ui/core";
import React, {ChangeEvent, useState} from "react";
import {makeStyles} from '@material-ui/core/styles';
import {enums} from "../enums";

const useStyles = makeStyles({
    textField: {
        width: "100%"
    },
    messageError: {
        textTransform: 'lowercase',
        color: 'red',
        fontSize: '0.8rem'
    },
    firstLetter: {
        textTransform: 'uppercase'
    }
})

type PropsType = {
    title: string;
    onClick: (title: string) => Promise<any>;
    entityStatus: enums.StatusRequest;
};
export const EditableTitleTodolist = React.memo(({title, onClick, entityStatus}: PropsType) => {

    const [newTitle, setNewTitle] = useState<string>('')
    const [toggleEditMode, setToggleEditMode] = useState<boolean>(false)
    const [messageError, setMessageError] = useState<string | null>(null)

    const classes = useStyles()

    const styleTitle = {
        color: entityStatus === enums.StatusRequest.loading ? 'gray' : '',
        cursor: 'pointer'
    }
    const firstLetter = messageError && messageError.charAt(0);

    const onChangeHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setNewTitle(event.currentTarget.value);
    }

    const activateEditMode = () => {
        setToggleEditMode(true)
        setNewTitle(title)
    }

    const deactivateEditMode = async () => {
        try {
            await onClick(newTitle.replace(/\s+/g, ' ').trim())
            setToggleEditMode(false)
            setMessageError(null)
        } catch (error: any) {
            setMessageError(error.message)
        }
    }

    return (
        <>
            {toggleEditMode ? (
                <TextField
                    className={classes.textField}
                    id="standard-multiline-flexible"
                    multiline
                    value={newTitle}
                    onChange={onChangeHandler}
                    onBlur={deactivateEditMode}
                    autoFocus
                />
            ) : (
                <Tooltip title="Edit" placement={"top"}>
                    <span style={styleTitle} onDoubleClick={activateEditMode}>{title}</span>
                </Tooltip>
            )}
            {messageError &&
                <span className={classes.messageError}>
                    <span className={classes.firstLetter}>{firstLetter}</span>
                    {messageError.slice(1)}
                </span>}
        </>
    );
});