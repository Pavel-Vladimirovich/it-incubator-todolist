import React, { ChangeEvent } from "react";

type propsInputType={
	title: string
	setTitle: (title:string) => void
}


const Input = (props: propsInputType) => {

	const onChangeInputHandler = (event: ChangeEvent<HTMLInputElement>)=>{
		props.setTitle(event.currentTarget.value);
	}

	return (
		<div>
			<input value={props.title} onChange={onChangeInputHandler}/>
		</div>
	)
}