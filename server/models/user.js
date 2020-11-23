const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const { signJwtToken } = require("../utilities/auth");
const { getRandomColor } = require("../utilities/helper");

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      lowercase: true,
    },
    verificationCode: {
      type: String,
      trim: true,
    },
    verified: {
      type: Boolean,
      default: false,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      trim: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Company",
    },
    tokens: {
      type: [String],
    },
    isPasswordSet: {
      type: Boolean,
      default: false,
    },
    color: {
      type: String,
      default: getRandomColor(),
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.password;
        delete ret.__v;
        delete ret.tokens;
        delete ret.verificationCode;
      },
    },
  }
);

userSchema.virtual("announcements", {
  ref: "Announcement",
  localField: "_id",
  foreignField: "owner",
});

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = signJwtToken(user);
  user.tokens.push(token);
  await user.save();

  return token;
};

userSchema.post("findOne", async function (doc) {
  await doc.populate("company").execPopulate();
  await doc.company
    .populate({
      path: "users",
      select: "_id email",
      match: { _id: { $ne: doc._id } },
    })
    .execPopulate();
});

userSchema.pre("save", async function (done) {
  if (this.isModified("password")) {
    var salt = bcrypt.genSaltSync(10);
    var hashedPwd = bcrypt.hashSync(this.get("password"), salt);
    this.set("password", hashedPwd);
  }
  done();
});

const User = mongoose.model("User", userSchema);

module.exports = User;
