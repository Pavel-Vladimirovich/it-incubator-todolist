import React, { useEffect, useState } from "react";
import {Grid, Typography} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
	arrow: {
		transform: "rotate(0deg)",
		border: "1px solid black",
		width: "100px",
	},
	tableClock:{
		width: 100,
		height: 100,
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		position: 'relative',
		border: "1px solid black",
		before: {
			content: '',
			position: "absolute",
			width: 15,
			height: 15,
			backgroundColor: 'black',
			borderRadius: '50%'
		},
	},
	hoursCircle:{
		// position: "absolute",
		// top: "50%",
		// left: "50%",
		width: '15px',
		height: "15px",
		borderRadius: "50%",
		backgroundColor: "black",
	},
	minutesHand:{
		// position: "absolute",
		// top: '50%',
		// left: "50%"
	},
	secondsHand:{
		// position: "absolute",
		// top: '50%',
		// left: "50%"
	},
	hoursHand:{
		// position: "absolute",
		// top: '50%',
		// left: "50%"
	},


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
		transformOrigin: "1px 60px",
		transform: `rotate(${6 *time.getSeconds()}deg)`,
		border: "1px solid red",
		height: "80px",
		backgroundColor: "red",
		// borderRadius: '50%',
	}
	let minutesHand = {
		transformOrigin: "0px 60px",
		transform: `rotate(${6 *time.getMinutes()}deg)`,
		border: "1px solid black",
		height: "50px",
		backgroundColor: "black",
		// borderRadius: '50%',

	}
	let hoursHand = {

		transformOrigin: "0px 60px",
		transform: `rotate(${time.getHours()*30 + time.getMinutes()/12}deg)`,
		border: "1px solid green",
		height: "40px",
		backgroundColor: "green",
		// borderRadius: '50%',
	}

	return(
		<Grid container alignItems="center" direction="column">
			<Grid item><Typography variant="h4" color="textSecondary">{time.toLocaleString("ru", options)}</Typography></Grid>
			<Grid item><Typography variant="h4" color="textSecondary">{time.getSeconds()}</Typography></Grid>
			<Grid item><Typography variant="h6" color="textSecondary">12</Typography></Grid>
			<Grid item>

			</Grid>
			<Grid item><Typography variant="h6" color="textSecondary">6</Typography></Grid>
			<div className={classes.tableClock}>
				<div className={classes.secondsHand} style={secondsHand}></div>
				<div className={classes.minutesHand} style={minutesHand}></div>
				<div className={classes.hoursHand} style={hoursHand}></div>
				<div className={classes.hoursCircle}></div>
			</div>
		</Grid>
	)
}

