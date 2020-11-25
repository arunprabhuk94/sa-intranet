const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
var randomize = require("randomatic");
const { ObjectId } = mongoose.Types;

const authMiddleware = require("../middlewares/auth");
const { body } = require("express-validator");

const User = require("../models/user");
const Company = require("../models/company");
const {
  sendVerificationEmail,
  sendAnnouncementEmail,
} = require("../utilities/emails");
const { validationErrors } = require("../middlewares/validation");
const { errorResponse } = require("../utilities/errorResponse");
const Announcement = require("../models/announcement");
const { getSearchType } = require("../utilities/helper");
const { getLookupArray, projectAndAdd } = require("../utilities/queries");

const router = new express.Router();

router.post(
  "/:id/comment",
  authMiddleware,
  [body("comment").isString().notEmpty()],
  validationErrors,
  async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const { comment } = req.body;
    try {
      const announcement = await Announcement.findOne({
        _id: id,
      });
      if (!announcement) throw new Error("Announcement not found!");
      const canComment = announcement.users.some(
        (usr) => usr.id.toString() === user.id.toString()
      );
      const isOwnComment = announcement.owner.id === user.id;
      if (!(canComment || isOwnComment)) throw new Error("Not authorized!");

      const newComment = {
        comment,
        owner: user.id,
        updatedAt: Date.now(),
        createdAt: Date.now(),
      };
      announcement.comments.push(newComment);
      await announcement.save();
      await announcement.populate("comments.owner").execPopulate();
      const lastCommentId = announcement.comments.length - 1;
      res.status(200).send({ comment: announcement.comments[lastCommentId] });
    } catch (e) {
      res.status(400).send(errorResponse(e));
    }
  }
);

router.get("/:id", authMiddleware, async (req, res) => {
  const user = req.user;
  const { id } = req.params;
  try {
    const announcement = await Announcement.findOne({
      owner: user.id,
      _id: id,
    });
    if (!announcement) throw new Error("Announcement not found");
    res.status(201).send({ announcement });
  } catch (e) {
    res.status(400).send(errorResponse(e));
  }
});

const fetchAllAnnouncements = async (user, searchText) => {
  const ownerLookupArray = getLookupArray({
    from: "users",
    as: "user",
    localField: "owner",
    foreignField: "_id",
    project: {
      name: 1,
      email: 1,
      color: 1,
    },
  });
  const commenterLookupArray = getLookupArray({
    from: "users",
    as: "comments.user",
    localField: "comments.owner",
    foreignField: "_id",
    arrayField: "comments",
    project: {
      name: 1,
      email: 1,
      color: 1,
    },
  });
  const findQuery = [...ownerLookupArray, ...commenterLookupArray];
  const matchQuery = [
    {
      $match: {
        $and: [
          {
            $or: [
              { "owner.id": ObjectId(user.id) },
              { "users.id": ObjectId(user.id) },
            ],
          },
          {
            $or: [{ date: { $gt: new Date() } }, { date: { $exists: false } }],
          },
        ],
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
    ...projectAndAdd(),
  ];
  if (searchText) {
    let { searchString, searchType } = getSearchType(searchText);
    if (["name", "email"].includes(searchType)) {
      searchType = `owner.${searchType}`;
    }
    matchQuery[0].$match[searchType] = {
      $regex: new RegExp(searchString, "i"),
    };
  }
  const finalQuery = findQuery.concat(matchQuery);
  return await Announcement.aggregate(finalQuery);
};

router.post(
  "/",
  authMiddleware,
  [
    body("subject").isString().notEmpty(),
    body("category").isString().notEmpty(),
    body("description").isString().notEmpty(),
    body("users").isArray(),
  ],
  validationErrors,
  async (req, res) => {
    const user = req.user;
    const { date } = req.body;
    const { searchText } = req.query;
    try {
      const announcementObj = {
        ...req.body,
        owner: user.id,
      };
      if (date) {
        announcementObj.date = new Date(date);
      }
      const announcement = new Announcement(announcementObj);
      await announcement.save();
      await announcement.populate("owner");
      sendAnnouncementEmail(announcement);

      const announcements = await fetchAllAnnouncements(user, searchText);
      res.status(200).send({ announcements });
    } catch (e) {
      res.status(400).send(errorResponse(e));
    }
  }
);

router.patch(
  "/:id",
  authMiddleware,
  [
    body("subject").isString().notEmpty(),
    body("category").isString().notEmpty(),
    body("description").isString().notEmpty(),
    body("users").isArray(),
  ],
  validationErrors,
  async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const updates = Object.keys(req.body);
    const { searchText } = req.query;
    const validFields = [
      "subject",
      "category",
      "date",
      "location",
      "description",
      "users",
    ];
    const canUpdate = updates.every((update) => validFields.includes(update));
    if (!canUpdate) throw new Error("Invalid updates!");

    try {
      const announcement = await Announcement.findOne({
        owner: user.id,
        _id: id,
      });
      if (!announcement) throw new Error("Announcement not found");
      updates.forEach((update) => (announcement[update] = req.body[update]));
      announcement.date = announcement.date || undefined;
      const reqUrl = `${req.protocol}://${req.get("host")}`;
      sendAnnouncementEmail(announcement, reqUrl);
      await announcement.save();

      const announcements = await fetchAllAnnouncements(user, searchText);

      res.status(201).send({ announcements });
    } catch (e) {
      res.status(400).send(errorResponse(e));
    }
  }
);

router.get("/", authMiddleware, async (req, res) => {
  const user = req.user;
  const { searchText } = req.query;
  try {
    const announcements = await fetchAllAnnouncements(user, searchText);

    res.status(201).send({ announcements });
  } catch (e) {
    res.status(400).send(errorResponse(e));
  }
});

module.exports = router;
