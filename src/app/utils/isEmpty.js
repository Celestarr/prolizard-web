const isEmpty = (obj) => {
  if (typeof obj === "undefined" || obj === null) {
    return true;
  }

  if (typeof obj === "string" && !obj.length) {
    return true;
  }

  if (Array.isArray(obj) && !obj.length) {
    return true;
  }

  if (typeof obj === "object" && !Object.keys(obj).length) {
    return true;
  }

  return false;
};

export default isEmpty;
