import "mibu/styles/index.scss";

import AdapterMoment from "@mui/lab/AdapterMoment";
import LocalizationProvider from "@mui/lab/LocalizationProvider";
// import enLocale from "date-fns/locale/en-US";
import App from "mibu/components/App";
import store from "mibu/store";
import reportWebVitals from "mibu/utils/report-web-vitals";
import { SnackbarProvider } from "notistack";
import React from "react";
import ReactDOM from "react-dom";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";
import { BrowserRouter } from "react-router-dom";

ReactDOM.render(
  <React.StrictMode>
    <HelmetProvider>
      <SnackbarProvider>
        <Provider store={store}>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </LocalizationProvider>
        </Provider>
      </SnackbarProvider>
    </HelmetProvider>
  </React.StrictMode>,
  document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
