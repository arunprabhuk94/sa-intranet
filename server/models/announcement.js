const mongoose = require("mongoose");
const { date } = require("yup");

const announcementSchema = new mongoose.Schema(
  {
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    category: {
      type: String,
      trim: true,
      required: true,
    },
    date: {
      type: mongoose.Schema.Types.Date,
    },
    location: {
      type: String,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    comments: [
      {
        owner: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        comment: {
          type: String,
          trim: true,
        },
        createdAt: {
          type: mongoose.Schema.Types.Date,
          default: Date.now,
        },
        updatedAt: {
          type: mongoose.Schema.Types.Date,
          default: Date.now,
        },
      },
    ],
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    users: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
          trim: true,
        },
        mailSent: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  {
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

announcementSchema.pre("find", function () {
  this.populate("owner");
});
announcementSchema.pre("findOne", function () {
  this.populate("owner");
});
announcementSchema.post("find", async function (docs) {
  if (doc.populate) {
    for (let doc of docs) {
      await doc.populate("comments.owner").execPopulate();
    }
  }
});
announcementSchema.post("findOne", async function (doc) {
  if (doc.populate) await doc.populate("comments.owner").execPopulate();
});

const Announcement = mongoose.model("Announcement", announcementSchema);

module.exports = Announcement;
