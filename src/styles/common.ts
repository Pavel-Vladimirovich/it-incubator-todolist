import { createTheme } from "@material-ui/core";

export const theme = createTheme({
    palette: {
      primary: {
        light: '#3492ca',
        main: '#3492ca',
        dark: '#0277bd',
        contrastText: '#fff',
      },
      secondary: {
        light: '#84c887	',
        main: '#66bb6a',
        dark: '#47824a',
        contrastText: '#fff',
      },
    },
    typography:{
        fontFamily: 'Roboto',
		fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
		fontWeightBold: 700,
        h1: {
            
        }
    },

  });

theme.typography.h1 = {
    fontSize: '1.2rem',
	fontWeight: 700,
    '@media (min-width:600px)': {
        fontSize: '1.5rem',
    },
    [theme.breakpoints.up('md')]: {
        fontSize: '2.4rem',
    },
};

theme.typography.h3 = {
    fontSize: '0.8rem',
	fontWeight: 400,
	color: theme.palette.primary.main,
    '@media (min-width:600px)': {
      fontSize: '1rem',
    },
    [theme.breakpoints.up('md')]: {
      fontSize: '1.2rem',
    },
  };