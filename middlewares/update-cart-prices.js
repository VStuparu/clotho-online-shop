async function updateCartPrices(request, response, next) {
  const cart = response.locals.cart;

  await cart.updatePrices();

  next();
}

module.exports = updateCartPrices;
