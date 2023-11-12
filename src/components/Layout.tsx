import { Container } from "@material-ui/core";
import React, { ReactNode } from "react";
import MenuAppBar from "./MenuAppBar";
import Snackbars from "./Snackbars";

type PropsType = {
	children: ReactNode
}

export const Layout = ({children}: PropsType) => {
	return(
		<>
		<MenuAppBar/>
        <Snackbars/>
		<Container maxWidth="xl">
		{children ?? ''}    
		</Container>
		</>
	)
}

