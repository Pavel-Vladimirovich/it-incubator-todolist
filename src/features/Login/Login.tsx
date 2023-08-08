import React, { useState } from "react";
import {
  Button,
  Card,
  CardContent,
  Checkbox,
  FormControlLabel,
  Grid,
  TextField,
  Typography,
} from "@material-ui/core";
import AccountCircle from "@material-ui/icons/AccountCircle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  root: {
    minWidth: 375,
  },
  container: {
    // border: '1px solid grey',
    marginTop: " 50px",
  },
});

export const Login = () => {
  const classes = useStyles();
  const [values, setValues] = useState<any>({
    amount: "",
    password: "",
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const handleChange =
    (prop: any) => (event: React.ChangeEvent<HTMLInputElement>) => {
      setValues({ ...values, [prop]: event.target.value });
    };

  const handleClickShowPassword = () => {
    setValues({ ...values, showPassword: !values.showPassword });
  };

  const handleMouseDownPassword = (
    event: React.MouseEvent<HTMLButtonElement>
  ) => {
    event.preventDefault();
  };
  return (
    <>
      <form noValidate autoComplete="off">
        <Grid container justifyContent="center" className={classes.container}>
          <Card variant="outlined" className={classes.root}>
            <CardContent>
              <Grid container direction="column" spacing={2}>
                <Grid item>
                  <TextField label="Enter your email" fullWidth required />
                </Grid>
                <Grid item>
                  <TextField type="password" label="Enter your pass" fullWidth required
                  />
                </Grid>
                <Grid item>
                  <FormControlLabel control={<Checkbox color="primary"/> } label={<Typography color="textSecondary">Remember me</Typography>}/>
                </Grid>
                <Grid item>
                  <Button color="primary" variant="outlined" fullWidth>
                    Enter
                  </Button>
                </Grid>
                </Grid>
            </CardContent>
          </Card>
        </Grid>
      </form>
    </>
  );
};
