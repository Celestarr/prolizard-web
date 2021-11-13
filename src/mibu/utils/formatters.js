/* eslint-disable import/prefer-default-export */

import moment from "moment";

export const formatDob = (dob) => moment(dob).format("MMMM D, YYYY");
