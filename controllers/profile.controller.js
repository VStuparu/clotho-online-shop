const User = require("../models/user.model");

async function getProfilePage(request, response, next) {
  try {
    const user = await User.findById(response.locals.uid);
    // console.log(user);
    // console.log(response.locals);
    const address = await user.getAddress();

    response.render("customer/profile/my-profile", {
      user: user,
      address: address,
    });
  } catch (error) {
    next(error);
  }
}

async function getAdressPage(request, response) {
  const userId = response.locals.uid;
  // console.log(userId);

  try {
    const user = await User.findById(userId);
    // console.log(user);
    if (!user) {
      return response.status(404).send("User not found");
    }

    const address = await user.getAddress();
    // console.log(address);
    response.render("customer/profile/manage-address", { address: address });
  } catch (error) {
    console.log(error);
  }
}

async function saveAddress(request, response, next) {
  const userId = response.locals.uid;

  const address = {
    name: request.body.name,
    phoneNumber: request.body["phone-number"],
    houseNumber: request.body["house-number"],
    street: request.body.street,
    city: request.body.city,
    zip: request.body.zip,
    country: request.body.country,
  };

  try {
    const user = await User.findById(userId);
    // console.log(user.constructor === User);

    if (!user) {
      return response.status(404).send("User not found");
    }

    // console.log(user.updateAddress(address));
    await user.updateAddress(address);

    // request.session.address = address;

    response.redirect(`/profile/${userId}/address`);
  } catch (error) {
    next(error);
  }
}

async function getEditProfile(request, response, next) {
  try {
    const user = await User.findById(response.locals.uid);
    response.render("customer/profile/update-profile", {
      user: user,
    });
  } catch (error) {
    next(error);
  }
}

async function updateProfile(request, response, next) {
  const userId = response.locals.uid;

  try {
    const user = await User.findById(userId);

    if (!user) {
      return response.status(404).send("User not found");
    }

    user.firstName = request.body["first-name"];
    user.lastName = request.body["last-name"];
    user.email = request.body.email;

    await user.update();

    response.redirect(`/profile/${userId}`);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getProfilePage: getProfilePage,
  getAdressPage: getAdressPage,
  saveAddress: saveAddress,
  getEditProfile: getEditProfile,
  updateProfile: updateProfile,
};
