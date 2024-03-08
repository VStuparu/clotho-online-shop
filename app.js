const path = require("path");

const express = require("express");
const expressSession = require("express-session");

const createSessionConfig = require("./config/session");
const db = require("./data/database");
const authRoutes = require("./routes/auth.routes");
const baseRoutes = require("./routes/base.routes");
const productRoutes = require("./routes/products.routes");
const adminRoutes = require("./routes/admin.routes");
const cartRoutes = require("./routes/cart.routes");
const profileRoutes = require("./routes/profile.routes");
const orderRoutes = require("./routes/orders.routes");
const errorHandlerMiddleware = require("./middlewares/error-handler");
const checkAuthStatusMiddleware = require("./middlewares/check-auth");
const protectRoutesMiddleware = require("./middlewares/protect-routes");
const cartMiddleware = require("./middlewares/cart");
const updateCartPricesMiddleware = require("./middlewares/update-cart-prices");

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static("public"));
app.use("/products/assets", express.static("product-data"));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

const sessionConfig = createSessionConfig();

app.use(expressSession(sessionConfig));

app.use(checkAuthStatusMiddleware);

app.use(cartMiddleware);
app.use(updateCartPricesMiddleware);

app.use(baseRoutes);
app.use(authRoutes);
app.use(productRoutes);
app.use(profileRoutes);
app.use("/cart", cartRoutes);
app.use(protectRoutesMiddleware);
app.use("/orders", orderRoutes);
app.use("/admin", protectRoutesMiddleware, adminRoutes);

app.use(errorHandlerMiddleware);

db.connectToDataBase()
  .then(function () {
    app.listen(3000);
  })
  .catch(function (error) {
    console.log(error);
  });
