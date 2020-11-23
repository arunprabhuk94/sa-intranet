const jwt = require("jsonwebtoken");
const User = require("../models/user");

const encryptKey =
  process.env.ENCRYPT_KEY || "workspacemanagementappencryption";

module.exports = {
  signJwtToken: (user) => {
    return jwt.sign({ _id: user._id.toString() }, encryptKey, {
      expiresIn: "30d",
    });
  },
  verifyJwtToken: async (token) => {
    const decodedInfo = jwt.verify(token, encryptKey);
    return decodedInfo._id;
  },
};
