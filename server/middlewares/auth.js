const User = require("../models/user");
const mongoose = require("mongoose");
const { verifyJwtToken } = require("../utilities/auth");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace(/Bearer\s?/, "");
    const userId = token ? await verifyJwtToken(token) : null;
    if (!userId) throw new Error();

    const foundInSession = req.session.tokens.find(
      (tokenElem) =>
        tokenElem.user.toString() === userId && tokenElem.token === token
    );
    const userSearch = { _id: userId };
    if (!foundInSession) userSearch.tokens = token;
    const user = await User.findOne(userSearch);
    if (!user) throw new Error();

    req.user = user;
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ errors: [{ msg: "Not Authenticated" }] });
  }
};
