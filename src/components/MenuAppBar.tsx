import {AppBar, IconButton, LinearProgress, Menu, MenuItem} from "@material-ui/core";
import Fab from "@material-ui/core/Fab";
import {makeStyles} from "@material-ui/core/styles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import {AccountCircle} from "@material-ui/icons";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import MenuIcon from "@material-ui/icons/Menu";
import React from "react";
import {useSelector} from "react-redux";
import {authActions, authSelectors} from "../features/Auth";
import {useDispatchedActions} from "../hooks/useAppDispatch";
import {enums} from "../enums";
import {ScrollTop} from "./ScrollTop";
import {appSelectors} from "../app";


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
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: theme.mixins.toolbar
}));

export default function MenuAppBar() {

  const {logoutAsync} = useDispatchedActions(authActions)

  const statusRequest = useSelector(appSelectors.status)
  const isLoggedIn = useSelector(authSelectors.isLoggedIn)
  const login = useSelector(authSelectors.login)
    
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null)

  const open = Boolean(anchorEl);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null)
  };

  const logoutHandler = () => {
    logoutAsync()
    setAnchorEl(null)
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
                }}                open={open}
                onClose={handleClose}
              >
                <MenuItem onClick={logoutHandler}>Logout</MenuItem>
              </Menu>
            </div>
          )}
        </Toolbar>
        {statusRequest === enums.StatusRequest.loading && (
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

