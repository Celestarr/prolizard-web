const makeChoiceMap = (items, keySource, valueSource) => {
  const map = {};
  items.forEach((item) => {
    map[item[keySource]] = item[valueSource];
  });
  return map;
};

export default makeChoiceMap;
