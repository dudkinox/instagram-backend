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
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../swagger");

const router = express.Router();

router.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

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
// router.delete("/login/:id", deleteAccount);

module.exports = {
  routes: router,
};
