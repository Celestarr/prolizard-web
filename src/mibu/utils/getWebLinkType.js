const getWebLinkType = (link) => {
  if (link.match(/facebook\.com/i)) {
    return "facebook";
  }

  if (link.match(/github\.com/i)) {
    return "github";
  }

  if (link.match(/linkedin\.com/i)) {
    return "linkedin";
  }

  if (link.match(/reddit\.com/i)) {
    return "reddit";
  }

  if (link.match(/twitter\.com/i)) {
    return "twitter";
  }

  if (link.match(/youtube\.com/i)) {
    return "youtube";
  }

  return "__unknown__";
};

export default getWebLinkType;
