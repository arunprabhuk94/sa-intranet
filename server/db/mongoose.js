const mongoose = require("mongoose");

const mongoUrl =
  process.env.MONGODB_URL || "mongodb://127.0.0.1:27017/workspace-management";

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
