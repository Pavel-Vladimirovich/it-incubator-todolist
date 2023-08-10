import { Container } from "@material-ui/core";
import React, { ReactNode } from "react";
import HideAppBar from "./MenuAppBar/HideAppBar";
import { CustomizedSnackbars } from "./Snackbar/Snackbar";

type PropsType = {
	children: ReactNode
}

export const Layout = ({children}: PropsType) => {
	return(
		<>
		<HideAppBar/>
        <CustomizedSnackbars/>
		<Container maxWidth="xl">
		{children ?? ''}    
		</Container>
		</>
	)
}

