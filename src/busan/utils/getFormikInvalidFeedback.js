import { getIn } from "formik";

const getFormikInvalidFeedback = (errors, touched, prop) => {
  const error = getIn(errors, prop);
  const touch = getIn(touched, prop);
  return error && touch ? error : undefined;
};

export default getFormikInvalidFeedback;
