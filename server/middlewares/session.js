const Session = require("../models/session");

module.exports = {
  startSession: async (req, res, next) => {
    try {
      let session = await Session.findOne({ session: true });
      if (!session) {
        session = new Session({ session: true, tokens: [] });
        await session.save();
      }
      req.session = session;
      next();
    } catch (err) {
      res
        .status(500)
        .send({ errors: [{ msg: "Session error. Please try again" }] });
    }
  },
};
