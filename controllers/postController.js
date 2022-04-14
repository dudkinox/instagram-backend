"use strict";

const e = require("express");
const firebase = require("../db");
const PostModel = require("../models/post");
const firestore = firebase.firestore();
const storage = require("../storage");
const bucket = storage.bucket();

const addPost = async (req, res, next) => {
  try {
    const id = req.params.id;

    const folder = "post";
    const filename = `${folder}/${Date.now()}`;
    const fileUpload = bucket.file(filename);

    const blobStream = fileUpload.createWriteStream({
      metadata: {
        contentType: req.file.mimetype,
        name: filename,
      },
    });

    blobStream.on("error", (err) => {
      res.status(405).json(err);
    });

    const searchFirebase = await firestore.collection("post").doc(id);
    const check = await searchFirebase.get();

    blobStream.on("finish", async () => {
      const data = req.body;
      const file = bucket.file(`post/${filename}`);
      const link =
        "https://firebasestorage.googleapis.com/v0" +
        file.parent.baseUrl +
        "/" +
        file.parent.name +
        file.baseUrl +
        "/" +
        folder +
        "%2F" +
        filename.split("/")[1] +
        "?alt=media";

      const dateString = new Date()
        .toISOString()
        .replace(/T/, " ")
        .replace(/\..+/, "");
      const classified = dateString.split(" ");
      const formatDate = classified[0].split("-");

      if (check.exists) {
        const result = check.data();
        result.list.push({
          postNo: check.data().list.length + 1,
          image: link,
          createAt: formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0],
          createTime: classified[1],
          caption: data.caption,
          countComment: 0,
          countLike: 0,
        });

        await searchFirebase.update(result);
      } else {
        const result = {
          list: [
            {
              postNo: 1,
              caption: data.caption,
              image: link,
              countComment: 0,
              countLike: 0,
              createAt:
                formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0],
              createTime: classified[1],
            },
          ],
        };

        await firestore.collection("post").doc(id).set(result);
      }

      return res.status(200).send("success");
    });

    blobStream.end(req.file.buffer);
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getAllPostByID = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await firestore.collection("post").doc(id);
    const data = await post.get();
    if (data.empty) {
      return res.status(404).send("not fond post");
    } else {
      return res.status(200).send(data.data());
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

const getAllFeed = async (req, res) => {
  try {
    const post = await firestore.collection("post");
    const data = await post.get();
    if (data.empty) {
      res.status(404).send("not fond post");
    } else {
      const FeedArray = [];

      data.forEach((doc) => {
        const postFeed = {
          id: doc.id,
          list: doc.data().list,
        };
        FeedArray.push(postFeed);
      });

      const result = [];
      for (var i = 0; i < FeedArray.length; i++) {
        const account = await firestore
          .collection("account")
          .doc(FeedArray[i].id);
        const searchAccount = await account.get();

        result.push({
          id: FeedArray[i].id,
          name: searchAccount.data().name,
          email: searchAccount.data().email,
          image: searchAccount.data().image,
          list: FeedArray[i].list,
        });
      }

      return res.status(200).send(result);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  addPost,
  getAllPostByID,
  getAllFeed,
};
