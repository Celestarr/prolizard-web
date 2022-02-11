import { bootApp } from "mibu/actions/app";
import GlobalSpinner from "mibu/components/GlobalSpinner";
import API from "mibu/services/api";
import qs from "qs";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

const AuthCallback = () => {
  const { search } = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    const parsedQs = qs.parse(search, { ignoreQueryPrefix: true });

    if (parsedQs.code) {
      API.OAuth2.requestAuthToken(parsedQs.code)
        .then((res) => {
          localStorage.setItem("oauth2:access_token", res.access_token);
          localStorage.setItem("oauth2:refresh_token", res.refresh_token);
          dispatch(bootApp());
        })
        .catch((err) => {
          console.log(err);
        });
    } else {
      console.log(parsedQs);
    }
  }, []);

  return <GlobalSpinner />;
};

export default AuthCallback;
