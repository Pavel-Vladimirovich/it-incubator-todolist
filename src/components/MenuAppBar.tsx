import { AppBar, IconButton, LinearProgress, Menu, MenuItem } from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import { makeStyles } from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import Zoom from "@material-ui/core/Zoom";
import { AccountCircle } from "@material-ui/icons";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import { useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { logoutAsync } from "../features/Auth/auth_reducer";
import { AppRootState } from "../app/store";
import { useAppDispatch } from "../hooks/useAppDispatch";
import {StatusRequest} from "../enums/statusRequest";

interface Props {
  children: React.ReactElement;
}
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
    textTransform: "uppercase",
    cursor: "default",
  },
  linearProgress: {
    height: "3px",
  },
  scrollTopButton: {
    position: "fixed",
    zIndex: 9999,
    bottom: theme.spacing(2),
    right: theme.spacing(2),
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar
}));

function ScrollTop(props: Props) {
  const { children } = props;
  const classes = useStyles();
  const trigger = useScrollTrigger({
    disableHysteresis: true,
    threshold: 100,
  });
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const anchor = (
      (event.target as HTMLDivElement).ownerDocument || document
    ).querySelector("#back-to-top-anchor");

    if (anchor) {
      anchor.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  return (
    <Zoom in={trigger}>
      <div
        onClick={handleClick}
        role="presentation"
        className={classes.scrollTopButton}
      >
        {children}
      </div>
    </Zoom>
  );
}

export default function MenuAppBar() {
  const dispatch = useAppDispatch();
  
  const statusRequest = useSelector<AppRootState>((store) => store.app.status);
  const isLoggedIn = useSelector<AppRootState, boolean>(
    (state) => state.authData.isLoggedIn
    );
  const login = useSelector<AppRootState, string>(state => state.authData.login)
    
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const logoutHandler = () => {
    dispatch(logoutAsync());
    setAnchorEl(null);
  };

  return (
    <div className={classes.root}>
      <AppBar position="fixed">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            Todo list
          </Typography>
          {login && <Typography variant="inherit">{login}</Typography>}
          {isLoggedIn && (
            <div>
              <IconButton
                aria-label="account of current user"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleMenu}
                color="inherit"
              >
                <AccountCircle />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                <MenuItem><NavLink to="/clock">clock</NavLink></MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
        {statusRequest === StatusRequest.loading && (
            <LinearProgress
              color={"primary"}
              className={classes.linearProgress}
            />
          )}
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <div className={classes.toolbar}></div>
      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div>
  );
}

