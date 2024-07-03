const makeValueIdMap = (items) => {
  const valueIdMap = {};
  items.forEach((item) => {
    valueIdMap[item.value] = item.id;
  });
  return valueIdMap;
};

export default makeValueIdMap;
