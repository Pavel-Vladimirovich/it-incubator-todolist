import React from "react";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import {
  AppBar,
  IconButton,
  LinearProgress,
  Menu,
  MenuItem,
} from "@material-ui/core";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import Zoom from "@material-ui/core/Zoom";
import Fab from "@material-ui/core/Fab";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { StatusRequest } from "../../app/app_reducer";
import { useSelector } from "react-redux";
import { AppRootState } from "../../app/store";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../app/auth_reducer";
import { AccountCircle } from "@material-ui/icons";
import {AuthDataType} from "../../api/todolist-api";

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
  const classes = useStyles();
  const dispatch = useDispatch<any>();
  const statusRequest = useSelector<AppRootState>((store) => store.app.status);
  const isLoggedIn = useSelector<AppRootState, boolean>(
    (state) => state.authData.isLoggedIn
  );
  const login = useSelector<AppRootState, string>(state => state.authData.login)
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

