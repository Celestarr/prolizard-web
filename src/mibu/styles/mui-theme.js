import { blue, teal } from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";

const muiTheme = createTheme({
  palette: {
    // background: {
    //   default: "#F6F7F9",
    // },
    primary: {
      main: blue[500],
    },
    secondary: {
      main: teal[500],
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
  },
  components: {
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          marginTop: -2,
        },
      },
    },
  },
});

export default muiTheme;
