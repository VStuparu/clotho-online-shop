function checkAuthStatus(request, response, next) {
  const uid = request.session.uid;

  if (!uid) {
    return next();
  }

  response.locals.uid = uid;
  response.locals.isAuth = true;
  response.locals.isAdmin = request.session.isAdmin;
  next();
}

module.exports = checkAuthStatus;
