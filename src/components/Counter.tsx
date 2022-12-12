
import React, {useState} from "react";

export const Counter = () => {
	const [count, setCounter] = useState(0);


	return (
		<div>
			<div>you cliked me {count} times</div>
			<button onClick={() => setCounter(count + 1)}>click</button>
		</div>
	)
}