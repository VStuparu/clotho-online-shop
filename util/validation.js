function isEmpty(value) {
  return !value || value.trim() === "";
}

function userCredentialsAreValid(email, password) {
  return email && email.includes("@") && password && password.trim().length > 5;
}

function userDetailsAreValid(firstName, lastName, email, password) {
  return (
    userCredentialsAreValid(email, password) &&
    !isEmpty(firstName) &&
    !isEmpty(lastName)
  );
}

module.exports = { userDetailsAreValid: userDetailsAreValid };
