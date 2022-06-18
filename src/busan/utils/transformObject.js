export default function transformObject(obj, { excludeKeys, includeKeys }) {
  const newObj = {};

  if (excludeKeys) {
    Object.keys(obj).forEach((key) => {
      if (!excludeKeys.includes(key)) {
        newObj[key] = obj[key];
      }
    });
  } else if (includeKeys) {
    Object.keys(obj).forEach((key) => {
      if (includeKeys.includes(key)) {
        newObj[key] = obj[key];
      }
    });
  }

  return newObj;
}
