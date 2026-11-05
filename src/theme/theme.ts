import { createTheme } from '@mui/material/styles';
import { fonts, tokens } from './tokens';

export const theme = createTheme({
  palette: {
    primary: { main: tokens.blue },
    secondary: { main: tokens.red },
    background: { default: tokens.paper, paper: tokens.white },
    text: { primary: tokens.ink, secondary: tokens.bodyText },
  },
  typography: {
    fontFamily: fonts.body,
    h1: { fontWeight: 800 },
    h2: { fontWeight: 800 },
    h3: { fontWeight: 800 },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        html: {
          scrollBehavior: 'smooth',
          '@media (prefers-reduced-motion: reduce)': { scrollBehavior: 'auto' },
        },
        '::selection': { backgroundColor: tokens.yellow, color: tokens.ink },
      },
    },
  },
});
