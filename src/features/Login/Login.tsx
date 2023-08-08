import React, {useState} from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup, FormHelperText,
  FormLabel,
  Grid,
  TextField,
  Typography
} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({
    container: {
        marginTop: " 90px",
    },
});

export const Login = () => {
    const classes = useStyles();
    const [values, setValues] = useState<any>({
        password: "",
    });

    return (
        <>
          <Grid container justifyContent="center" className={classes.container}>
            <Grid item lg={4} sm={6} xs={12}>
              <form noValidate autoComplete="off" onSubmit={(e)=>{e.preventDefault()}}>
                <FormControl fullWidth>
                  <FormLabel>Sign in:</FormLabel>
                  <FormGroup>
                    <TextField label="Enter your email"/>
                    <FormHelperText>email</FormHelperText>
                    <TextField label="Enter your pass"/>
                    <FormHelperText>password</FormHelperText>
                    <FormControlLabel control={<Checkbox color="primary"/>}
                                      label={<Typography color="textSecondary">Remember
                                        me</Typography>}/>
                    <Button type={"submit"} color="primary" variant="outlined" fullWidth>sign in</Button>
                  </FormGroup>
                </FormControl>
              </form>
            </Grid>
          </Grid>
        </>
    );
};
