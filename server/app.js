const express = require("express");
const cors = require("cors");
const path = require("path");
require("./db/mongoose");
const userRouter = require("./routes/user");
const announcementRouter = require("./routes/announcement");
const { startSession } = require("./middlewares/session");

const app = express();
app.use(cors());
app.use(express.json());
app.use("/", express.static(path.join(__dirname, "../build")));
app.use(startSession);

app.use("/api/announcements", announcementRouter);
app.use("/api/users", userRouter);
app.use("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../build", "index.html"));
});

module.exports = app;
