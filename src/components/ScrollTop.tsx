import useScrollTrigger from "@material-ui/core/useScrollTrigger";
import React from "react";
import Zoom from "@material-ui/core/Zoom";
import {makeStyles} from "@material-ui/core/styles";

interface Props {
    children: React.ReactElement;
}
const useStyles = makeStyles((theme) => ({
    scrollTopButton: {
        position: "fixed",
        zIndex: 9999,
        bottom: theme.spacing(2),
        right: theme.spacing(2),
    },
}));

export const ScrollTop = (props: Props) => {
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