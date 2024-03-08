function notFoundHandler(request, response) {
  response.status(404).render("shared/404");
}

module.exports = notFoundHandler;
