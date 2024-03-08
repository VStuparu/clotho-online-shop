function protectRoutes(request, response, next) {
  if (!response.locals.isAuth) {
    return response.redirect("/401");
  }

  if (request.path.startsWith("/admin") && !response.locals.isAdmin) {
    return response.redirect("/403");
  }

  next();
}

module.exports = protectRoutes;
