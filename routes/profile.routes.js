const express = require("express");

const profileController = require("../controllers/profile.controller");

const router = express.Router();

router.get("/profile/:id", profileController.getProfilePage);

router.get("/profile/:id/address", profileController.getAdressPage);

router.post("/profile/:id/address", profileController.saveAddress);

router.get("/profile/:id/edit", profileController.getEditProfile);

router.post("/profile/:id/edit", profileController.updateProfile);

module.exports = router;
