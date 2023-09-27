import React from "react";
import {isRouteErrorResponse, useRouteError} from "react-router-dom";
import {makeStyles, Typography} from "@material-ui/core";
import errorImg from "../assets/images/error.jpg";
import {theme} from "../styles/common";

const useStyles = makeStyles({
  container: {
	display: "flex",
	alignItems: "center",
	justifyContent: "center",
	height: "100vh",
    textAlign: "center",
    color: theme.palette.text.secondary,
  },
  errorImg:{
	maxWidth: "650px",
	width: "100%",
  },
  btn:{
	marginTop: "10px",
  }
});

export const ErrorPage = () => {
	const error = useRouteError();
	
	const classes = useStyles();

  if (isRouteErrorResponse(error)) {
    return (
      <div id="error-page" className={classes.container}>
		<div>
			<img src={errorImg} alt={error.statusText} className={classes.errorImg}/>
			<Typography variant="h3" component="h1">
				Oops! {error.status}
			</Typography>
			<Typography>{error.statusText}</Typography>
			{error.data?.message && (
			<Typography>
				<i>{error.data.message}</i>
			</Typography>
			)}
		</div>
      </div>
    );
  } else if (error instanceof Error) {
    return (
      <div id="error-page" className={classes.container}>
		<div>
			<Typography variant="h3" component="h1">
				Oops! Unexpected Error</Typography>
			<Typography>Something went wrong.</Typography>
			<Typography>
				<i>{error.message}</i>
			</Typography>
		</div>
      </div>
    );
  } else {
    return <></>;
  }
}