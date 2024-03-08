const Product = require("../models/product.model");
// const Cart = require("../models/cart.model");

function getCartItems(request, response) {
  response.render("customer/cart/checkout");
}

async function addCartItem(request, response, next) {
  let product;
  try {
    product = await Product.findById(request.body.productId);
    // console.log(product);
  } catch (error) {
    next(error);
    return;
  }

  const cart = response.locals.cart;

  cart.addItem(product);
  request.session.cart = cart;

  response
    .status(201)
    .json({ message: "Cart updated", newTotalItems: cart.totalQuantity });
}

function updateCartItem(request, response) {
  const cart = response.locals.cart;

  const updatedItemData = cart.updateItem(
    request.body.productId,
    +request.body.quantity
  );

  request.session.cart = cart;

  response.json({
    message: "itemupdated",
    updatedCartData: {
      newTotalQuantity: cart.totalQuantity,
      newTotalPrice: cart.totalPrice,
      updatedItemPrice: updatedItemData.updatedItemPrice,
    },
  });
}

module.exports = {
  addCartItem: addCartItem,
  getCartItems: getCartItems,
  updateCartItem: updateCartItem,
};
