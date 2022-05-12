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

    const searchComment = await firestore.collection("comment").doc(id);
    const checkComment = await searchComment.get();

    if (checkComment.exists) {
      const result = checkComment.data();
      result.list.push({
        createAt: formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0],
        createTime: classified[1],
        comment: body.comment,
        name: body.name,
        postNo: body.postNo,
      });

      await searchComment.update(result);
    } else {
      await firestore
        .collection("comment")
        .doc(id)
        .set({
          list: [
            {
              createAt:
                formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0],
              createTime: classified[1],
              image: body.image,
              name: body.name,
              comment: body.comment,
              postNo: body.postNo,
            },
          ],
        });
    }

    const searchPost = await firebase.firestore().collection("post").doc(id);
    const check = await searchPost.get();

    const result = check.data();
    if (check.exists) {
      result.list.forEach((item) => {
        if (item.postNo === body.postNo) {
          item.countComment = item.countComment + 1;
        }
      });
    }

    await firestore.collection("post").doc(id).update(result);

    return res.status(200).send("success");
  } catch (error) {
    return res.status(400).send(" " + error.message);
  }
};

const getCommentAll = async (req, res) => {
  try {
    const response = await firestore.collection("comment").get();
    const data = response.docs.map((item) => {
      return { id: item.id, ...item.data() };
    });
    return res.status(200).send(data);
  } catch (error) {
    return res.status(400).send(" " + error.message);
  }
};

module.exports = {
  addComment,
  getCommentAll,
};
