import React, { useEffect, useState } from "react";


export const Clock = () => {


	const [time, setTime] = useState(1)


	useEffect(()=>{
		setInterval(()=>{
			setTime(state => state + 1)
		}, 1000)	
	}, [])
	


	return(
		<>
			{time}
		</>
	)
}

