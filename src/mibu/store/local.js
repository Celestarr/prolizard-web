const localStore = {
  clearTokens: () => {
    sessionStorage.removeItem("auth:accessToken");
    localStorage.removeItem("auth:accessToken");
    sessionStorage.removeItem("auth:refreshToken");
    localStorage.removeItem("auth:refreshToken");
  },
  getTokens: () => ({
    accessToken: sessionStorage.getItem("auth:accessToken")
      || localStorage.getItem("auth:accessToken"),
    refreshToken: sessionStorage.getItem("auth:refreshToken")
      || localStorage.getItem("auth:refreshToken"),
  }),
  setTokens: (accessToken, refreshToken, persist) => {
    if (persist) {
      localStorage.setItem("auth:accessToken", accessToken);
      localStorage.setItem("auth:refreshToken", refreshToken);
    } else {
      sessionStorage.setItem("auth:accessToken", accessToken);
      sessionStorage.setItem("auth:refreshToken", refreshToken);
    }
  },
};

export default localStore;
