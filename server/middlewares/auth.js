const User = require("../models/user");
const { verifyJwtToken } = require("../utilities/auth");

module.exports = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const userId = await verifyJwtToken(token);
    if (!userId) throw new Error();
    req.user = await User.findOne({ _id: userId, tokens: token });
    if (!req.user) throw new Error();
    req.token = token;
    next();
  } catch (err) {
    res.status(401).send({ errors: [{ msg: "Not Authenticated" }] });
  }
};
