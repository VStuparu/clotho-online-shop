function handleErrors(error, request, response, next) {
  if (error.code === 404) {
    response.status(404).render("shared/404");
  }

  response.status(500).render("shared/500");
}

module.exports = handleErrors;
