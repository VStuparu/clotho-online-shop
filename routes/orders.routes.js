const express = require("express");

const ordersController = require("../controllers/orders.controller");

const router = express.Router();

router.get("/", ordersController.getOrders);

router.post("/", ordersController.addOrder);

router.get("/success", ordersController.getSuccess);

router.get("/failure", ordersController.getFailure);

router.get("/:id/cancel", ordersController.cancelOrder);

router.get("/:id", ordersController.getOrder);

module.exports = router;
