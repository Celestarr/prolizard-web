import BasicError from "app/components/BasicError";
import React from "react";
import { useAuth } from "react-oidc-context";

function AuthCallback() {
  const { error } = useAuth();

  if (!error) {
    return null;
  }

  return <BasicError error={error} />;
}

export default AuthCallback;
