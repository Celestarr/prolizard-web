const submitTransformHelper = (records, fields) => {
  const newRecords = [...records].map((record) => {
    const newRecord = { ...record };
    fields.forEach((field) => {
      if (newRecord[field]) {
        newRecord[field] = newRecord[field].value;
      }
    });
    return newRecord;
  });
  return newRecords;
};

export default submitTransformHelper;
