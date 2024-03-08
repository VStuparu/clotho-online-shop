const User = require("../models/user.model");
const authUtil = require("../util/authentication");
const validation = require("../util/validation");
const sessionFlash = require("../util/session-flash");

function getSignup(request, response) {
  let sessionData = sessionFlash.getSessionData(request);
  if (!sessionData) {
    sessionData = {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
    };
  }

  response.render("customer/auth/signup", { inputData: sessionData });
}

async function signup(request, response, next) {
  const user = new User(
    request.body["first-name"],
    request.body["last-name"],
    request.body.email,
    request.body.password
  );

  const enteredData = {
    firstName: request.body["first-name"],
    lastName: request.body["last-name"],
    email: request.body.email,
    password: request.body.password,
  };

  if (
    !validation.userDetailsAreValid(
      request.body["first-name"],
      request.body["last-name"],
      request.body.email,
      request.body.password
    )
  ) {
    sessionFlash.flashDataToSession(
      request,
      {
        errorMessage:
          "Please check your input. Password must be at least 6 character long",
        ...enteredData,
      },
      function () {
        response.redirect("/signup");
      }
    );

    return;
  }
  try {
    const existsAlready = await user.existsAlready();
    if (existsAlready) {
      sessionFlash.flashDataToSession(
        request,
        {
          errorMessage: "User exists already! Please log in instead!",
          ...enteredData,
        },
        function () {
          response.redirect("/signup");
        }
      );

      return;
    }

    await user.signup();
  } catch (error) {
    next(error);
  }

  response.redirect("/login");
}

function getLogin(request, response) {
  let sessionData = sessionFlash.getSessionData(request);

  if (!sessionData) {
    sessionData = {
      email: "",
      password: "",
    };
  }

  response.render("customer/auth/login", { inputData: sessionData });
}

async function login(request, response, next) {
  const user = new User(null, null, request.body.email, request.body.password);
  let existingUser;
  try {
    existingUser = await user.getUserWithSameEmail();
    // console.log(existingUser);
  } catch (error) {
    next(error);
    return;
  }

  const sessionErrorData = {
    errorMessage:
      "Invalid credentials - please double-check your email and password",
    email: user.email,
    password: user.password,
  };

  if (!existingUser) {
    sessionFlash.flashDataToSession(request, sessionErrorData, function () {
      response.redirect("/login");
    });

    return;
  }

  const passwordIsCorrect = await user.hasMatchingPassword(
    existingUser.password
  );

  // console.log(existingUser);

  if (!passwordIsCorrect) {
    sessionFlash.flashDataToSession(request, sessionErrorData, function () {
      response.redirect("/login");
    });

    return;
  }

  authUtil.createUserSession(request, existingUser, function () {
    // console.log("dfdaf");
    response.redirect("/");
  });
}

function logout(request, response) {
  authUtil.destroyUserAuthSession(request);
  request.session.cart = null;
  response.redirect("/login");
}

module.exports = {
  getSignup: getSignup,
  getLogin: getLogin,
  signup: signup,
  login: login,
  logout: logout,
};
