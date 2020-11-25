const mongoose = require("mongoose");

const sessionSchema = new mongoose.Schema(
  {
    session: {
      type: Boolean,
      default: true,
    },
    tokens: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        token: {
          type: String,
          trim: true,
        },
      },
    ],
  },
  {
    strict: false,
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        ret.id = ret._id;
        delete ret._id;
        delete ret.__v;
      },
    },
  }
);

sessionSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const Session = mongoose.model("Session", sessionSchema);

module.exports = Session;
