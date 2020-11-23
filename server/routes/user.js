const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var randomize = require("randomatic");

const authMiddleware = require("../middlewares/auth");
const { body } = require("express-validator");

const User = require("../models/user");
const Company = require("../models/company");
const { sendVerificationEmail } = require("../utilities/emails");
const { validationErrors } = require("../middlewares/validation");
const { errorResponse } = require("../utilities/errorResponse");
const { getRandomColor } = require("../utilities/helper");

const router = new express.Router();

router.post(
  "/signup",
  [body("email").isEmail()],
  validationErrors,
  async (req, res) => {
    const { email } = req.body;

    try {
      const user = await User.findOne({ email });
      if (user) throw new Error("Email already exists");

      const newUser = new User({
        email,
        verificationCode: randomize("A0", 6),
        color: getRandomColor(),
      });

      await newUser.save();
      sendVerificationEmail(newUser);
      const token = await newUser.generateAuthToken();

      res.status(201).send({ user: newUser, token });
    } catch (e) {
      res.status(400).send(errorResponse(e));
    }
  }
);

router.post(
  "/verifyemail",
  authMiddleware,
  [body("verificationCode").notEmpty().isLength(6)],
  validationErrors,
  async (req, res) => {
    const user = req.user;
    const { verificationCode } = req.body;

    try {
      if (user.verificationCode !== verificationCode)
        throw new Error("OTP is incorrect");

      user.verificationCode = "";
      user.verified = true;
      await user.save();

      res.send({ user });
    } catch (e) {
      res.status(400).send(errorResponse(e));
    }
  }
);

router.post(
  "/setcompanydetails",
  authMiddleware,
  [
    body("companyName").notEmpty(),
    body("noOfEmployees").isInt({ min: 1 }),
    body("location").notEmpty(),
    body("domainName").notEmpty(),
  ],
  validationErrors,
  async (req, res) => {
    const user = req.user;
    const { companyName, noOfEmployees, location, domainName } = req.body;

    try {
      let company = await Company.findOne({ companyName });
      if (!company) {
        company = new Company({
          companyName,
          noOfEmployees,
          location,
          domainName,
        });
      } else {
        company.noOfEmployees = noOfEmployees;
        company.location = location;
        company.domainName = domainName;
      }
      await company.save();
      user.company = company._id;
      await user.save();

      res.send({ user });
    } catch (e) {
      res.status(400).send(errorResponse(e));
    }
  }
);

router.post(
  "/setpassword",
  authMiddleware,
  [
    body("password").isLength({ min: 6, max: 50 }),
    body("name").isLength({ min: 3, max: 101 }),
  ],
  validationErrors,
  async (req, res) => {
    const user = req.user;
    const { password, name } = req.body;

    try {
      user.name = name;
      user.password = password;
      user.isPasswordSet = true;
      await user.save();

      res.status(201).send({ user });
    } catch (e) {
      res.status(400).send(errorResponse(e));
    }
  }
);

router.post(
  "/login",
  [body("email").isEmail()],
  validationErrors,
  async (req, res) => {
    let { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user || (user.password && !password))
        throw new Error("Invalid Credentials");
      if (user.password) {
        const doesPasswordMatch = bcrypt.compareSync(password, user.password);
        if (!doesPasswordMatch) throw new Error("Invalid Credentials");
      }

      const token = await user.generateAuthToken();
      res.status(200).send({ user, token, users: user.company.users });
    } catch (e) {
      res.status(500).send(errorResponse(e));
    }
  }
);

router.get("/autologin", authMiddleware, async (req, res) => {
  res.status(200).send({ user: req.user, users: req.user.company.users });
});

router.get("/logout", authMiddleware, async (req, res) => {
  req.user.tokens = req.user.tokens.filter((token) => token !== req.token);
  await req.user.save();
  res.status(200).send({ user: req.user });
});

router.get("/logoutall", authMiddleware, async (req, res) => {
  req.user.tokens = [];
  await req.user.save();
  res.status(200).send({ user: req.user });
});

module.exports = router;
