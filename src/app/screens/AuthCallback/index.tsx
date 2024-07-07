import BasicError from "app/components/BasicError";
import React from "react";
import { useAuth } from "react-oidc-context";

export default function AuthCallback() {
  const { error } = useAuth();

  if (!error) {
    return null;
  }

  return <BasicError error={error} />;
}
