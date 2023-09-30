import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";
import { useSelector } from "react-redux";
import { setAppError, setAppStatusRequest } from "../app/app_reducer";
import { AppRootState } from "../app/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {enums} from "../enums";

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

const CustomizedSnackbars = React.memo(()=>{
  
  const dispatch = useAppDispatch();
  
  const error  = useSelector<AppRootState, string | null>((state) => state.app.error);
  // const statusRequest = useSelector<AppRootState, enums.StatusRequest>((state)=>state.app.status)
  
  const classes = useStyles();
  
  const isError = error !== null
  // const isStatus = statusRequest === enums.StatusRequest.succeeded
 
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setAppStatusRequest({status: enums.StatusRequest.idle}))
    dispatch(setAppError({error: null}))
  };


  return (
    <div className={classes.root}>
      <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose}>
        <Alert onClose={handleClose} severity={"error"}>
          some error occurred
        </Alert>
      </Snackbar>
    </div>
  );
})

export default CustomizedSnackbars