import React, { useEffect, useState } from "react";
import {Grid} from "@material-ui/core";
import "./clock.css"


export const Clock = () => {
	const [time, setTime] = useState(new Date())
	// const options: any = {
	// 	era: 'long',
	// 	year: 'numeric',
	// 	month: 'long',
	// 	day: 'numeric',
	// 	weekday: 'long',
	// 	timezone: 'UTC',
	// 	hour: 'numeric',
	// 	minute: 'numeric',
	// 	second: 'numeric'
	// };
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
			<Grid item>
				{/*<Typography variant="h4" color="textSecondary">{time.toLocaleString("ru", options)}</Typography>*/}
			</Grid>
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

