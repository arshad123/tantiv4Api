module.exports.success = (data, message, statusCode) => {
  return {
    message: message ? capitalize(message) : "Success",
    error: false,
    code: statusCode ? statusCode : 200,
    data,
  };
};

module.exports.successPagination = (data, message, statusCode) => {
  return {
    message: message ? capitalize(message) : "Success",
    error: false,
    code: statusCode ? statusCode : 200,
    data: data && data.length ? data[0].data : null,
    pagination: data && data.length ? data[0].pagination : null,
  };
};

module.exports.error = (message, statusCode, errorObj) => {
  // List of common HTTP request code
  const codes = [200, 201, 400, 401, 404, 403, 409, 422, 500];

  // Get matched code
  const findCode = codes.find((code) => code == statusCode);

  if (!findCode) statusCode = 500;
  else statusCode = findCode;

  return {
    message: capitalize(message),
    code: statusCode,
    error: true,
    errorObj,
  };
};

module.exports.validationError = (error) => {
  return {
    message: error.details[0].message,
    code: 400,
    error: true,
  };
};

function capitalize(string) {
  return string && string[0]
    ? string[0].toUpperCase() + string.substring(1)
    : "";
}
