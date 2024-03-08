function getAboutPage(request, response) {
  response.render("shared/about");
}

function getContactPage(request, response) {
  response.render("shared/contact");
}

module.exports = {
  getAboutPage: getAboutPage,
  getContactPage: getContactPage,
};
