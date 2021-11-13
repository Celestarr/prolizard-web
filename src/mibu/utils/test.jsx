import { render as rtlRender } from "@testing-library/react";
import store from "mibu/store";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";

const render = (
  ui,
  {
    ...renderOptions
  } = {},
) => {
  const Wrapper = ({ children }) => (
    <HelmetProvider>
      <Provider store={store}>
        {children}
      </Provider>
    </HelmetProvider>
  );
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { render };
