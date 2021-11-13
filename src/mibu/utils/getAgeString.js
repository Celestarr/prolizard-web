import moment from "moment";

const getAgeString = (dob) => moment(dob).fromNow(true);

export default getAgeString;
