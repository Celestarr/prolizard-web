import sleep from "app/utils/sleep";
import { fireEvent, render, screen } from "app/utils/test";
import React from "react";

import App from "./index";

test("full app rendering/navigating (guest only)", async () => {
  render(<App />);

  await sleep(2500);

  const signInElements = screen.queryAllByText(/sign in/i);
  expect(signInElements).toHaveLength(2);

  fireEvent.click(screen.getByText(/sign up/i));

  await sleep(2000);

  const signUpElements = screen.queryAllByText(/sign up/i);
  expect(signUpElements).toHaveLength(2);
});
