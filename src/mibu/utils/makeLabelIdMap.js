const makeLabelIdMap = (items) => {
  const labelIdMap = {};
  items.forEach((item) => {
    labelIdMap[item.label] = item.id;
  });
  return labelIdMap;
};

export default makeLabelIdMap;
