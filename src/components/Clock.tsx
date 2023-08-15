import React, { useEffect, useState } from "react";
import {Grid, Typography} from "@material-ui/core";


export const Clock = () => {

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
		setInterval(()=>{
			setTime(new Date())
		}, 1000)
	}, [])
	


	return(
		<Grid container justifyContent="center">
			<Grid item><Typography variant="h4" color="textSecondary">{time.toLocaleString("ru", options)}</Typography></Grid>
		</Grid>
	)
}

