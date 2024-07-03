import { render as rtlRender } from "@testing-library/react";
import store from "app/store";
import React from "react";
import { HelmetProvider } from "react-helmet-async";
import { Provider } from "react-redux";

const render = (
  ui,
  {
    ...renderOptions
  } = {},
) => {
  function Wrapper({ children }) {
    return (
      <HelmetProvider>
        <Provider store={store}>
          {children}
        </Provider>
      </HelmetProvider>
    );
  }
  return rtlRender(ui, { wrapper: Wrapper, ...renderOptions });
};

export * from "@testing-library/react";
export { render };
