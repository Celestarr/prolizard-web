/* eslint-disable no-param-reassign */

import keys from "lodash/keys";
import snakeCase from "lodash/snakeCase";

const snakeCaseTransformHelper = (values) => values.map((x) => {
  keys(x).forEach((k) => {
    const sk = snakeCase(k);
    if (sk !== k) {
      x[snakeCase(k)] = x[k];
      delete x[k];
    }
  });
  return x;
});

export default snakeCaseTransformHelper;
