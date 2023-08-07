import React, {useState} from "react"
import {Button, Container, Grid, TextField} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    field: {
        border: '1px solid grey',
        marginTop: " 50px",


    },
    field2: {
        // border: '1px solid black',
    }

})


export const Login = () => {
const classes = useStyles()
const [values, setValues] = useState<any>({
    amount: '',
    password: '',
    weight: '',
    weightRange: '',
    showPassword: false,
});

const handleChange = (prop: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
    setValues({ ...values, [prop]: event.target.value });
};

const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
};

const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
};
return(
    <>
        <Container maxWidth="xl">
            <form noValidate autoComplete="off">
                <Grid container justifyContent="center" direction="column" alignItems="center" spacing={3} className={classes.field} >
                    <Grid container spacing={1} alignItems="flex-end" justifyContent="center" className={classes.field2}>
                        <Grid item>
                            <TextField id="input-with-icon-grid" label="Enter your email" required />
                        </Grid>
                        {/*<Grid item>*/}
                        {/*    <AccountCircle />*/}
                        {/*</Grid>*/}
                    </Grid>
                    <Grid item>
                        <TextField type='password' label="Enter your pass" fullWidth required/>
                    </Grid>
                    <Grid item>
                        <Button color="primary" variant="outlined" fullWidth>Enter</Button>
                    </Grid>
                </Grid>
            </form>
        </Container>

    </>
)
}