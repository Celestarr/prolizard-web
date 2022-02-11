import GlobalSpinner from "mibu/components/GlobalSpinner";
import makeAuthorizeUrl from "mibu/utils/oauth/make-authorize-url";
import React, { useEffect } from "react";

const AuthorizeScreen = () => {
  useEffect(() => {
    makeAuthorizeUrl()
      .then((res) => {
        window.location.href = res;
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return <GlobalSpinner />;
};

export default AuthorizeScreen;
