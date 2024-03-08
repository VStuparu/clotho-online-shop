const baseController = require("../controllers/base.controller");

const express = require("express");

const router = express.Router();

router.get("/", function (request, response, next) {
  response.redirect("/products");
});

router.get("/401", function (request, response) {
  response.status(401).render("shared/401");
});

router.get("/403", function (request, response) {
  response.status(403).render("shared/403");
});

router.get("/about", baseController.getAboutPage);

router.get("/contact", baseController.getContactPage);

module.exports = router;
