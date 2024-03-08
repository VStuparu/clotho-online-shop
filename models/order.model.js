const db = require("../data/database");

const mongodb = require("mongodb");

class Order {
  constructor(cart, userData, status = "pending", date, orderId) {
    this.productData = cart;
    this.userData = userData;
    this.status = status;
    this.date = new Date(date);
    if (this.date) {
      this.formattedDate = this.date.toLocaleDateString("en-US", {
        weekday: "short",
        day: "numeric",
        month: "long",
        year: "numeric",
      });
    }

    this.id = orderId;
  }

  static transformOrderDocument(orderDoc) {
    return new Order(
      orderDoc.productData,
      orderDoc.userData,
      orderDoc.status,
      orderDoc.date,
      orderDoc._id
    );
  }

  static transformOrderDocuments(orderDocs) {
    return orderDocs.map(this.transformOrderDocument);
  }

  static async findAll() {
    const orders = await db
      .getDb()
      .collection("orders")
      .find()
      .sort({ _id: -1 })
      .toArray();

    return this.transformOrderDocuments(orders);
  }

  static async findAllForUser(email) {
    try {
      const orders = await db
        .getDb()
        .collection("orders")
        .find({ "userData.email": email })
        .sort({ _id: -1 })
        .toArray();

      return this.transformOrderDocuments(orders);
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async findById(orderId) {
    const order = await db
      .getDb()
      .collection("orders")
      .findOne({ _id: new mongodb.ObjectId(orderId) });

    return this.transformOrderDocument(order);
  }

  async updateStatus(status) {
    const orderId = new mongodb.ObjectId(this.id);
    await db
      .getDb()
      .collection("orders")
      .updateOne({ _id: orderId }, { $set: { status: status } });
  }

  save() {
    if (this.id) {
      const orderId = new mongodb.ObjectId(this.id);

      return db
        .getDb()
        .collection("orders")
        .updateOne({ _id: orderId }, { $set: { status: this.status } });
    } else {
      const orderDocument = {
        productData: this.productData,
        userData: this.userData,
        productData: this.productData,
        date: new Date(),
        status: this.status,
      };

      const result = db.getDb().collection("orders").insertOne(orderDocument);
      this.id = result.insertedId;

      return result;
    }
  }
}

module.exports = Order;
