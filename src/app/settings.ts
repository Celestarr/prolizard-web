const AppSettings = {
  ENV: process.env.NODE_ENV as string,
  APP_NAME: process.env.REACT_APP_APP_NAME as string,
  API_BASE_URL: process.env.REACT_APP_API_BASE_URL as string,
  PORTFOLIO_BASE_URL: process.env.REACT_APP_PORTFOLIO_BASE_URL as string,
  IDENTITY_BASE_URL: process.env.REACT_APP_IDENTITY_BASE_URL as string,
  OAUTH_BASE_URL: process.env.REACT_APP_OAUTH_BASE_URL as string,
  OAUTH_CLIENT_ID: process.env.REACT_APP_OAUTH_CLIENT_ID as string,
};

export default AppSettings;
