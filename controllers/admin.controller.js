const Product = require("../models/product.model");
const Order = require("../models/order.model");

async function getProducts(request, response, next) {
  try {
    const products = await Product.findAll();
    response.render("admin/products/all-products", { products: products });
  } catch (error) {
    next(error);
    return;
  }
}

function getNewProduct(request, response) {
  response.render("admin/products/new-product");
}

async function createNewProduct(request, response, next) {
  const product = new Product({
    ...request.body,
    image: request.file.filename,
  });

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  response.redirect("/admin/products");
}

async function getUpdateProduct(request, response, next) {
  try {
    const product = await Product.findById(request.params.id);
    response.render("admin/products/update-product", { product: product });
    // console.log(product);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(request, response, next) {
  const product = new Product({
    ...request.body,
    _id: request.params.id,
  });

  if (request.file) {
    product.replaceImage(request.file.filename);
  }

  try {
    await product.save();
  } catch (error) {
    next(error);
    return;
  }

  response.redirect("/admin/products");
}

async function getOrders(request, response, next) {
  try {
    const orders = await Order.findAll();
    response.render("admin/orders/admin-orders", { orders: orders });
  } catch (error) {
    next(error);
  }
}

async function updateOrder(request, response, next) {
  const orderId = request.params.id;
  const newStatus = request.body.newStatus;

  try {
    const order = await Order.findById(orderId);

    order.status = newStatus;

    await order.save();

    response.json({ message: "Order updated", newStatus: newStatus });
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(request, response, next) {
  let product;
  try {
    product = await Product.findById(request.params.id);
    // console.log(product);
    await product.remove();
  } catch (error) {
    next(error);
    return;
  }

  response.json("ok");
}

module.exports = {
  getNewProduct: getNewProduct,
  createNewProduct: createNewProduct,
  getProducts: getProducts,
  getUpdateProduct: getUpdateProduct,
  updateProduct: updateProduct,
  deleteProduct: deleteProduct,
  getOrders: getOrders,
  updateOrder: updateOrder,
};
