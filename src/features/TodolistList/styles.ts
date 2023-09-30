import {makeStyles} from "@material-ui/core/styles";
import {theme} from "../../styles/common";

export const useStyles = makeStyles({
    linearProgressContainer: {
        height: "3px"
    },
    linearProgress: {
        height: "3px",
    },
    title: {
        textTransform: "uppercase",
        letterSpacing: ".15rem",
        cursor: "default",
    },
    span: {
        color: theme.palette.primary.main
    }

})