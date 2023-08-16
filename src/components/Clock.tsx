import React, { useEffect, useState } from "react";
import {Button, Grid, Typography} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	arrow: {
		transform: "rotate(0deg)",
		border: "1px solid black",
		width: "100px",
	}
}))

export const Clock = () => {

	const classes = useStyles()

	const [time, setTime] = useState(new Date())

	const options: any = {
		era: 'long',
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'long',
		timezone: 'UTC',
		hour: 'numeric',
		minute: 'numeric',
		second: 'numeric'
	};

	useEffect(()=>{
		const clock = setInterval(()=>{
			setTime(new Date())
		}, 1000)
		return () =>{
			clearInterval(clock)
		}
	}, [])


	let secondsHand = {
		transformOrigin: "0px 0px",
		transform: `rotate(${time.getSeconds()*6}deg)`,
		border: "1px solid black",
		width: "80px",
		height: "0px",
		borderRadius: '50%',
		backgroundColor: "black"
	}
	let minutesHand = {
		transformOrigin: "0px 80px",
		transform: `rotate(${time.getMinutes()*6}deg)`,
		border: "1px solid red",
		width: "1px",
		height: "80px",
		borderRadius: '50%',
		backgroundColor: "red"
	}

	return(
		<Grid container alignItems="center" direction="column">
			<Grid item><Typography variant="h4" color="textSecondary">{time.toLocaleString("ru", options)}</Typography></Grid>
			<Grid item><Typography variant="h4" color="textSecondary">{time.getSeconds()}</Typography></Grid>
			<Grid item><Typography variant="h6" color="textSecondary">12</Typography></Grid>
			<Grid item style={{border: '1px solid red', position:"relative"}}><div style={secondsHand}></div><div style={minutesHand}></div></Grid>
		</Grid>
	)
}

