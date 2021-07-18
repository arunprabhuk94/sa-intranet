const mongoose = require("mongoose");

const mongoUser = process.env.MONGODB_USERNAME || "127.0.0.1";
const mongoPwd = process.env.MONGODB_PASSWORD || "127.0.0.1";
const mongoHost = process.env.MONGODB_HOST || "127.0.0.1";
const mongoPort = process.env.MONGODB_PORT || "27017";
const mongoDbName = process.env.MONGODB_DB || "workspace-management";
const mongoUrl =
  process.env.MONGODB_URL ||
  `mongodb:${mongoUser}:${mongoPwd}//${mongoHost}:${mongoPort}/${mongoDbName}`;

const connectMongoDb = async () => {
  try {
    await mongoose.connect(mongoUrl, {
      useNewUrlParser: true,
      useCreateIndex: true,
      useFindAndModify: false,
      useUnifiedTopology: true,
    });
    console.log("connected to MongoDB");
  } catch (err) {
    console.log("Error in connecting to MongoDB");
  }
};

connectMongoDb();
