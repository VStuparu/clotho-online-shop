const stripe = require("stripe")(
  "sk_test_51ObT8KJs5oWyXO2MqUlmzPBjdC0IlqDUnDoLhFoeqGC9W9hipP6F2pav3fZyKxIU8qldtrSmBIcHL5hKJ4wGmuI200rggmBG1z"
);

const Order = require("../models/order.model");
const User = require("../models/user.model");
const Product = require("../models/product.model");

async function getOrders(request, response, next) {
  try {
    const userId = response.locals.uid;
    const user = await User.findById(userId);
    const userEmail = user.email;
    const orders = await Order.findAllForUser(userEmail);

    for (const order of orders) {
      for (const item of order.productData.items) {
        const product = await Product.findById(item.product.id);

        item.product.image = product.image;
      }
    }

    response.render("customer/orders/all-orders", {
      orders: orders,
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

async function addOrder(request, response, next) {
  const cart = response.locals.cart;
  // console.log(cart);
  let userDocument;
  try {
    userDocument = await User.findById(response.locals.uid);
  } catch (error) {
    next(error);
    return;
  }

  const order = new Order(cart, userDocument);
  try {
    await order.save();
  } catch (error) {
    next(error);
    return;
  }

  request.session.cart = null;

  const session = await stripe.checkout.sessions.create({
    line_items: cart.items.map(function (item) {
      return {
        price_data: {
          currency: "gbp",
          product_data: {
            name: item.product.title,
          },
          unit_amount: +item.product.price.toFixed(2) * 100,
        },
        quantity: item.quantity,
      };
    }),
    mode: "payment",
    success_url: "http://localhost:3000/orders/success",
    cancel_url: "http://localhost:3000/orders/failure",
  });

  response.redirect(303, session.url);
}

async function getOrder(request, response, next) {
  const orderId = request.params.id;

  // console.log(orderId);

  const order = await Order.findById(orderId);

  try {
    response.render("customer/orders/view-order", { order: order });
  } catch (error) {
    next(error);
  }
}

async function cancelOrder(request, response, next) {
  const orderId = request.params.id;

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return response.status(404).send("Order not found");
    }

    await order.updateStatus("cancelled");
    response.redirect("/orders");
  } catch (error) {
    next(error);
  }
}

function getSuccess(request, response) {
  response.render("customer/orders/success");
}

function getFailure(request, response) {
  response.render("customer/orders/failure");
}

module.exports = {
  addOrder: addOrder,
  getOrders: getOrders,
  getOrder: getOrder,
  cancelOrder: cancelOrder,
  getSuccess: getSuccess,
  getFailure: getFailure,
};
