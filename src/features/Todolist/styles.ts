import {makeStyles} from "@material-ui/core/styles";

export const useStyles = makeStyles({
    container: {
        display: "grid",
        gridTemplateColumns: "1fr",
        gridTemplateRows: "auto auto auto auto",
        gap: "25px",
        padding: "10px",
    },
    header: {
        display: "flex",
        alignItems: "center",
    },
    title: {
        flex: "1 1 auto",
        textTransform: "uppercase",
        letterSpacing: '.1rem',
        wordBreak: "break-word"
    }
})

