import {
  lightBlue as primaryColor,
} from "@mui/material/colors";
import { createTheme } from "@mui/material/styles";
import merge from "lodash/merge";

const PRIMARY = primaryColor[700];
const PRIMARY_DARK = primaryColor[800];
const PRIMARY_LIGHT = primaryColor.A200;

const customColors = {
  dark: {
    background: {
      default: "#202220",
      paper: "#353635",
    },
    primary: {
      main: PRIMARY,
      dark: PRIMARY_DARK,
      light: PRIMARY_LIGHT,
      contrastText: "#ffffff",
    },
  },
  light: {
    background: {
      default: "#f3f3f3",
      paper: "#ffffff",
    },
    primary: {
      main: PRIMARY,
      dark: PRIMARY_DARK,
      light: PRIMARY_LIGHT,
      contrastText: "#ffffff",
    },
  },
};

const defaultThemes = {
  dark: createTheme({ palette: { mode: "dark" } }),
  light: createTheme({ palette: { mode: "light" } }),
};

const commonSettings = {
  components: {
    MuiAlertTitle: {
      styleOverrides: {
        root: {
          marginTop: -2,
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {},
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          paddingBottom: 0,
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },
  },
  typography: {
    fontFamily: "'Roboto', sans-serif",
    fontSize: 13,
  },
};

const themes = {
  dark: createTheme({
    components: {
      MuiAlertTitle: merge({}, commonSettings.components.MuiAlertTitle),
      MuiAppBar: merge({}, commonSettings.components.MuiAppBar, {
        styleOverrides: {
          root: {
            backgroundColor: customColors.dark.background.default,
            color: defaultThemes.dark.palette.text.primary,
          },
        },
      }),
      MuiDialogContent: merge({}, commonSettings.components.MuiDialogContent),
      MuiPaper: merge({}, commonSettings.components.MuiPaper),
    },
    palette: {
      background: customColors.dark.background,
      mode: "dark",
      primary: customColors.dark.primary,
    },
    typography: commonSettings.typography,
  }),
  light: createTheme({
    components: {
      MuiAlertTitle: merge({}, commonSettings.components.MuiAlertTitle),
      MuiAppBar: merge({}, commonSettings.components.MuiAppBar, {
        styleOverrides: {
          root: {
            backgroundColor: customColors.light.background.default,
            color: defaultThemes.light.palette.text.primary,
          },
        },
      }),
      MuiDialogContent: merge({}, commonSettings.components.MuiDialogContent),
      MuiPaper: merge({}, commonSettings.components.MuiPaper),
    },
    palette: {
      background: customColors.light.background,
      mode: "light",
      primary: customColors.light.primary,
    },
    typography: commonSettings.typography,
  }),
};

export default themes;
