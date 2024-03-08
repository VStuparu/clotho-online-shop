const bcrypt = require("bcrypt");
const mongodb = require("mongodb");

const db = require("../data/database");

class User {
  constructor(firstName, lastName, email, password) {
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.password = password;
    this.address = null;
  }

  getUserWithSameEmail() {
    return db.getDb().collection("users").findOne({ email: this.email });
  }

  async signup() {
    const hashedPassword = await bcrypt.hash(this.password, 12);

    await db.getDb().collection("users").insertOne({
      firstName: this.firstName,
      lastName: this.lastName,
      email: this.email,
      password: hashedPassword,
      address: null,
    });
  }

  async updateAddress(address) {
    await db
      .getDb()
      .collection("users")
      .updateOne({ email: this.email }, { $set: { address: address } });
  }

  async getAddress() {
    const userData = await db
      .getDb()
      .collection("users")
      .findOne({ email: this.email });

    if (!userData) {
      throw new Error("User not found");
    }

    return userData.address;
  }

  async existsAlready() {
    const existingUser = await this.getUserWithSameEmail();

    if (existingUser !== null) {
      return true;
    }

    return false;
  }

  hasMatchingPassword(hashedPassword) {
    return bcrypt.compare(this.password, hashedPassword);
  }

  static async findById(userId) {
    const uid = new mongodb.ObjectId(userId);
    const userData = await db.getDb().collection("users").findOne({ _id: uid });

    if (!userData) {
      return null;
    }

    const user = new User(
      userData.firstName,
      userData.lastName,
      userData.email,
      userData.password,
      userData.address
    );

    user.address = await user.getAddress();

    return user;
  }

  async update() {
    await db
      .getDb()
      .collection("users")
      .updateOne(
        { email: this.email },
        {
          $set: {
            firstName: this.firstName,
            lastName: this.lastName,
            email: this.email,
          },
        }
      );
  }
}

module.exports = User;
