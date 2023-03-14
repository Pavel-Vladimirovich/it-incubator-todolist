import React from "react";
import s from "./Button.module.scss";

type propsButtonType = {
	name: string
	callBack: ()=> void
	className: string
}

export const Button = (props: propsButtonType) => {

	return (
		<div>
			<button className={s.btn} onClick={props.callBack}> {props.name}</button>
		</div>
	)
}