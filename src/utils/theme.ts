import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
});

export const darkTheme = createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#121212',
        paper: '#1d1d1d',
      },
      text: {
        primary: '#ffffff',
        secondary: '#b0b0b0',
      },
    },
    typography: {
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#121212',
            color: '#ffffff',
          },
          h1: {
            color: '#ffffff',
          },
          h2: {
            color: '#ffffff',
          },
          h3: {
            color: '#ffffff',
          },
          p: {
            color: '#ffffff',
          },
          hover: {
            backgroundColor: "#333333",
          }
        },

      },
    },
  });
  
  export const lightTheme = createTheme({
    palette: {
      mode: 'light',
      background: {
        default: '#ffffff',
      },
      text: {
        primary: '#000000',
        secondary: '#555555',
      },
    },
    typography: {
    },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: {
            backgroundColor: '#ffffff',
            color: '#000000',
          },
          h1: {
            color: '#000000',
          },
          h2: {
            color: '#000000',
          },
        },
      },
    },
  });
  
export default theme;