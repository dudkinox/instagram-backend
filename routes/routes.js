const express = require("express");
const Multer = require("multer");
const multer = Multer({
  storage: Multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});
const {
  getAllAccount,
  getAccount,
  getLogin,
  postRegister,
  updateAccount,
  updateImageAccount,
} = require("../controllers/loginController");
const {
  addPost,
  getAllPostByID,
  getAllFeed,
} = require("../controllers/postController");
const { LikePost, getLike } = require("../controllers/likeController");

const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../swagger");

const router = express.Router();

router.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

// account
router.get("/account", getAllAccount);
router.get("/account/:id", getAccount);
router.get("/account/:email/:password", getLogin);
router.post("/account", multer.single("img"), postRegister);
router.put("/account/:id", updateAccount);
router.put(
  "/account/update-image/:id",
  multer.single("img"),
  updateImageAccount
);

// post instagram
router.get("/post-feed/:id", getAllPostByID);
router.get("/feed/all/:id", getAllFeed);
router.post("/post-feed/:id", multer.single("img"), addPost);

// like this post
router.patch("/like/:id/:no", LikePost);
router.get("/like", getLike);

module.exports = {
  routes: router,
};
