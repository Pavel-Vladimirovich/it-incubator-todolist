import React from "react";
import Snackbar from "@material-ui/core/Snackbar";
import MuiAlert, {AlertProps} from "@material-ui/lab/Alert";
import {makeStyles, Theme} from "@material-ui/core/styles";
import {useDispatch, useSelector} from "react-redux";
import {AppStateType} from "../../app/store";
import {setAppError, setAppStatusRequest, StatusRequest} from "../../app/app_reducer";

function Alert(props: AlertProps) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    width: "100%",
    "& > * + *": {
      marginTop: theme.spacing(2),
    },
  },
}));

export const CustomizedSnackbars = React.memo(()=>{
  const classes = useStyles();

  const error  = useSelector<AppStateType, string | null>((state) => state.app.error);
  // const status = useSelector<AppStateType, StatusRequest>(state=>state.app.status)
  const dispatch = useDispatch();

  const isError = error !== null
  // const isSucceeded = status === StatusRequest.succeeded

  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setAppStatusRequest(StatusRequest.idle))
    dispatch(setAppError(null))
  };

  return (
    <div className={classes.root}>
      <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={"error"}>
            {error ? error : null}
        </Alert>
      </Snackbar>
    </div>
  );
})
