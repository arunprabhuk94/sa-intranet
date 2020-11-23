const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const companySchema = new mongoose.Schema(
  {
    companyName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    location: {
      type: String,
      trim: true,
    },
    noOfEmployees: {
      type: Number,
      default: 0,
    },
    domainName: {
      type: String,
      trim: true,
    },
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

companySchema.virtual("users", {
  ref: "User",
  localField: "_id",
  foreignField: "company",
});

const Company = mongoose.model("Company", companySchema);

module.exports = Company;
