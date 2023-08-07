import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import {Button, IconButton, LinearProgress} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import { makeStyles } from '@material-ui/core/styles';
import Zoom from '@material-ui/core/Zoom';
import Fab from '@material-ui/core/Fab';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import {StatusRequest} from "../../app/app_reducer";
import {useSelector} from "react-redux";
import {AppStateType} from "../../app/store";
import {NavLink} from "react-router-dom";

interface Props {
	children: React.ReactElement;
  }
const useStyles = makeStyles((theme) => ({
	scrollTopButton: {
		position: 'fixed',
		zIndex: 9999,
		bottom: theme.spacing(2),
		right: theme.spacing(2),
	},
	menuButton: {
	  	marginRight: theme.spacing(2),
	},
	title: {
		flexGrow: 1,
		textTransform: "uppercase",
		cursor: "default"
	},
	linearProgressContainer: {
		height: "3px"
	},
	linearProgress: {
		height: "3px",
	},

  }));

function ScrollTop(props: Props) {
	const { children } = props;
	const classes = useStyles();
	const trigger = useScrollTrigger({
	  disableHysteresis: true,
	  threshold: 100,
	});
	const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
	  const anchor = ((event.target as HTMLDivElement).ownerDocument || document).querySelector(
		'#back-to-top-anchor',
	  );
  
	  if (anchor) {
		anchor.scrollIntoView({ behavior: 'smooth', block: 'center' });
	  }
	};
  
	return (
	  <Zoom in={trigger}>
		<div onClick={handleClick} role="presentation" className={classes.scrollTopButton}>
		  {children}
		</div>
	  </Zoom>
	);
  }

export default function HideAppBar() {
	const classes = useStyles();
	const statusRequest = useSelector<AppStateType>(store => store.app.status)

  return (
    <>
	  <AppBar position={'fixed'}>
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Todo list
          </Typography>
			<NavLink to="/login">
				Login
			</NavLink>
        </Toolbar>
	  	<div className={classes.linearProgressContainer}>{statusRequest === StatusRequest.loading && <LinearProgress color={'primary'} className={classes.linearProgress}/>}</div>
      </AppBar>
      <Toolbar id="back-to-top-anchor"/>
	  <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </>
  );
}
