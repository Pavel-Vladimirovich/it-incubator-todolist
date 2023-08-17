import React, { useEffect, useState } from "react";
import {Grid, Typography} from "@material-ui/core";
import { makeStyles } from "@material-ui/core/styles";
import "./clock.css"

const useStyles = makeStyles((theme) => ({
	

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


	return(
		<Grid container alignItems="center" direction="column">
			<Grid item><Typography variant="h4" color="textSecondary">{time.toLocaleString("ru", options)}</Typography></Grid>
			<Grid item><Typography variant="h4" color="textSecondary">{time.getSeconds()}</Typography></Grid>
			<Grid item>
				<div className="clock">
					<div className="hour">
						<div style={{transform: `rotate(${time.getHours()*30 + time.getMinutes()/12}deg)`}} className="hr" id="hr"></div>
					</div>
					<div className="min">
						<div style={{transform: `rotate(${6 *time.getMinutes()}deg)`}} className="mn" id="mn"></div>
					</div>
					<div className="sec">
						<div style={{transform: `rotate(${6 *time.getSeconds()}deg)`}} className="sc" id="sc"></div>
					</div>
				</div></Grid>
		</Grid>
	)
}

