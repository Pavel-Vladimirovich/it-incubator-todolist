import { Container } from "@material-ui/core";
import React, { ReactNode } from "react";
import MenuAppBar from "./MenuAppBar/MenuAppBar";
import { CustomizedSnackbars } from "./Snackbar/Snackbar";

type PropsType = {
	children: ReactNode
}

export const Layout = ({children}: PropsType) => {
	return(
		<>
		<MenuAppBar/>
        <CustomizedSnackbars/>
		<Container maxWidth="xl">
		{children ?? ''}    
		</Container>
		</>
	)
}

