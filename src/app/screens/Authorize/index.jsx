import GlobalSpinner from "app/components/GlobalSpinner";
import makeAuthorizeUrl from "app/utils/oauth/make-authorize-url";
import React, { useEffect } from "react";

function AuthorizeScreen() {
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
}

export default AuthorizeScreen;
