import isEmpty from "./isEmpty";

export default function makeLocationString(address, country) {
  const isAddressEmpty = isEmpty(address);
  const isCountryEmpty = isEmpty(country);

  if (!isAddressEmpty && !isCountryEmpty) {
    return `${address}, ${country}`;
  }

  if (isAddressEmpty && !isCountryEmpty) {
    return country;
  }

  if (!isAddressEmpty && isCountryEmpty) {
    return address;
  }

  return null;
}
