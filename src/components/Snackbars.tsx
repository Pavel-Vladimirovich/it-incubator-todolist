import Snackbar from "@material-ui/core/Snackbar";
import { makeStyles, Theme } from "@material-ui/core/styles";
import MuiAlert, { AlertProps } from "@material-ui/lab/Alert";
import React from "react";
import { useSelector } from "react-redux";
import { setAppError, setAppStatusRequest, StatusRequest } from "../app/app_reducer";
import { AppRootState } from "../app/store";
import { useAppDispatch } from "../hooks/useAppDispatch";

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
  const statusRequest = useSelector<AppRootState, StatusRequest>((state)=>state.app.status)
  
  const classes = useStyles();
  
  const isError = error !== null
  const isStatus = statusRequest === StatusRequest.succeeded
 
  const handleClose = (event?: React.SyntheticEvent, reason?: string) => {
    if (reason === "clickaway") {
      return;
    }
    dispatch(setAppStatusRequest({status: StatusRequest.idle}))
    dispatch(setAppError({error: null}))
  };

  return (
    <div className={classes.root}>
      <Snackbar open={isError || isStatus} autoHideDuration={6000} onClose={handleClose}>
        {isStatus ? 
          <Alert onClose={handleClose} severity={"success"}>
            success
          </Alert>
        :
          <Alert onClose={handleClose} severity={"info"}>
            {error ? error : null}
          </Alert>
        }
      </Snackbar>
    </div>
  );
})

export default CustomizedSnackbars