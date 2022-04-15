"use strict";

const firebase = require("../db");
const LikeModel = require("../models/like");
const firestore = firebase.firestore();

const LikePost = async (req, res) => {
  try {
    const id = req.params.id;
    const no = req.params.no;

    const likes = await firestore.collection("like").doc(id);
    const check = await likes.get();

    const dateString = new Date()
      .toISOString()
      .replace(/T/, " ")
      .replace(/\..+/, "");
    const classified = dateString.split(" ");
    const formatDate = classified[0].split("-");

    if (!check.exists) {
      await likes.set({
        list: [
          {
            createAt: formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0],
            createTime: classified[1],
            image: req.body.image,
            name: req.body.name,
            postNo: no,
          },
        ],
      });

      const updateLike = await firestore.collection("post").doc(id);
      const update = await updateLike.get();
      if (update.exists) {
        const result = update.data();
        result.list[no - 1].countLike += 1;
        await updateLike.update(result);
      } else {
        return res.status(404).send("not fond post");
      }
    } else {
      if (
        check
          .data()
          .list.map((item) => item.postNo)
          .includes(no) &&
        check
          .data()
          .list.map((item) => item.name)
          .includes(req.body.name)
      ) {
        const result = check.data();
        const index = result.list.map((item) => item.postNo).indexOf(no);
        result.list.splice(index, 1);
        await likes.update(result);

        const unLike = await firestore.collection("post").doc(id);
        const data = await unLike.get();
        const like = data.data();
        like.list[no - 1].countLike -= 1;
        await unLike.update(like);
      } else {
        const result = check.data();
        result.list.push({
          createAt: formatDate[2] + "/" + formatDate[1] + "/" + formatDate[0],
          createTime: classified[1],
          image: req.body.image,
          name: req.body.name,
          postNo: no,
        });

        await likes.update(result);

        const updateLike = await firestore.collection("post").doc(id);
        const update = await updateLike.get();
        if (update.exists) {
          const result = update.data();
          result.list[no - 1].countLike += 1;
          await updateLike.update(result);
        } else {
          return res.status(404).send("not fond post");
        }
      }
    }

    return res.status(200).send("success");
  } catch (error) {
    return res.status(400).send("test " + error.message);
  }
};

const getLike = async (req, res) => {
  try {
    const name = req.body.name;

    const like = await firestore.collection("like");
    const data = await like.get();
    const LikeArray = [];
    if (data.empty) {
      return res.status(404).send("not fond");
    } else {
      data.forEach((doc) => {
        const likePost = new LikeModel(doc.id, doc.data().list);
        LikeArray.push(likePost);
      });

      return res.status(200).send(LikeArray);
    }
  } catch (error) {
    return res.status(400).send(error.message);
  }
};

module.exports = {
  LikePost,
  getLike,
};
