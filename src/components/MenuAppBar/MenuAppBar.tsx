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
import { AppStateType } from "../../app/store";
import { useDispatch } from "react-redux";
import { logoutAsync } from "../../app/auth_reducer";
import { AccountCircle } from "@material-ui/icons";

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
  linearProgressContainer: {
    height: "3px",
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
  const statusRequest = useSelector<AppStateType>((store) => store.app.status);
  const isLoggedIn = useSelector<AppStateType, boolean>(
    (state) => state.authData.isLoggedIn
  );
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
      <AppBar position={"fixed"}>
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
        <div className={classes.linearProgressContainer}>
          {statusRequest === StatusRequest.loading && (
            <LinearProgress
              color={"primary"}
              className={classes.linearProgress}
            />
          )}
        </div>
      </AppBar>
      <Toolbar id="back-to-top-anchor" />
      <ScrollTop>
        <Fab color="secondary" size="small" aria-label="scroll back to top">
          <KeyboardArrowUpIcon />
        </Fab>
      </ScrollTop>
    </div>
  );
}

