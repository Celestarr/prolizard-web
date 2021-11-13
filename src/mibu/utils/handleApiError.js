const handleApiError = (err) => {
  console.log(err.response, Object.keys(err));
  let errorMessage;
  if (!err.response) {
    errorMessage = "Server is unreachable. Check your connection.";
  } else {
    const { status } = err.response;
    if (status > 500) {
      errorMessage = "Server is unreachable.";
    } else {
      const { data } = err.response;
      errorMessage = data && data.detail
        ? `${data.detail}`
        : "Unknown error.";
    }
  }
  const error = new Error(errorMessage);
  error.message = errorMessage;
  error.api = true;
  throw error;
};

export default handleApiError;
