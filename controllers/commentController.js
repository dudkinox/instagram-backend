"use strict";

const firebase = require("../db");
const CommentModel = require("../models/comment");
const firestore = firebase.firestore();

const addComment = async (req, res) => {
  try {
    const id = req.params.id;
    const body = req.body;

    const dateString = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");

    const classified = dateString.split(" ");
    const formatDate = classified[0].split("-");

    const comment = await firestore
      .collection("comment")
      .doc(id)
      .set({
        list: [
          {
            createAt: formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0],
            createTime: classified[1],
            image: body.image,
            name: body.name,
            comment: body.comment,
            postNo: body.postNo,
          },
        ],
      });
    return res.status(200).send("success");
  } catch (error) {
    return res.status(400).send(" " + error.message);
  }
};

module.exports = {
  addComment,
};
