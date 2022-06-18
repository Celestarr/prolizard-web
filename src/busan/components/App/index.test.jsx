import sleep from "busan/utils/sleep";
import { fireEvent, render } from "busan/utils/test";
import React from "react";

import App from "./index";

test("full app rendering/navigating (guest only)", async () => {
  const { getByText, queryAllByText } = render(<App />);

  await sleep(2500);

  const signInElements = queryAllByText(/sign in/i);
  expect(signInElements).toHaveLength(2);

  fireEvent.click(getByText(/sign up/i));

  await sleep(2000);

  const signUpElements = queryAllByText(/sign up/i);
  expect(signUpElements).toHaveLength(2);
});
