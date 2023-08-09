import React from "react";
import { useFormik } from 'formik';
import * as Yup from 'yup';
import {Button,Checkbox, FormControl, FormControlLabel, FormGroup, FormHelperText, FormLabel, Grid, TextField, Typography} from "@material-ui/core";
import {makeStyles} from "@material-ui/core/styles";
import { setAuthenticatorDataAsync } from "../../app/auth_reducer";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { AppStateType } from "../../app/store";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles({
    container: {
        marginTop: " 90px",
    },
});

export const Login = () => {
    const navigate = useNavigate();
    const authenticatorData = useSelector<AppStateType>(state => state.authData.authDataSuccess)
    const dispatch = useDispatch<any>()

    if(authenticatorData){
      navigate('/')
    }

    const classes = useStyles();
    const formik = useFormik({
      initialValues: {
        email: '',
        password: '',
      },
      validationSchema: Yup.object({
        email: Yup.string().email('Invalid email address').required('Required'),
        password: Yup.string().required('Required')
      }),
      onSubmit: values => {
        dispatch(setAuthenticatorDataAsync(values))
      },
    });
    

    return (
        <>
          <Grid container justifyContent="center" className={classes.container}>
            <Grid item lg={4} sm={6} xs={12}>
              <form noValidate autoComplete="off" onSubmit={formik.handleSubmit}>
                <FormControl fullWidth>
                  <FormLabel>Sign in:</FormLabel>
                  <FormGroup>
                   <TextField label="Enter your email" type="email" {...formik.getFieldProps('email')}/>
                    {formik.touched.email && formik.errors.email ? 
                    <FormHelperText variant="outlined" error>{formik.errors.email}</FormHelperText> : <FormHelperText variant="outlined">email</FormHelperText>}
                    <TextField label="Enter your pass" type="password" {...formik.getFieldProps('password')}/>
                    {formik.touched.password && formik.errors.password ? 
                    <FormHelperText variant="outlined" error>{formik.errors.password}</FormHelperText> : <FormHelperText variant="outlined">password</FormHelperText>}
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
