const Product = require("../models/product.model");

async function getAllProducts(request, response, next) {
  try {
    const products = await Product.findAll();
    response.render("customer/products/all-products", { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

async function getProductDetails(request, response, next) {
  try {
    const product = await Product.findById(request.params.id);
    response.render("customer/products/product-details", { product: product });
  } catch (error) {
    console.log(error);
    next(error);
    return;
  }
}

module.exports = {
  getAllProducts: getAllProducts,
  getProductDetails: getProductDetails,
};
