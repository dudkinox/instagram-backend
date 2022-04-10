const express = require("express");
const {
  getAllAccount,
  getAccount,
  getLogin,
} = require("../controllers/loginController");
const swaggerUi = require("swagger-ui-express");
const swaggerDoc = require("../swagger");

const router = express.Router();

router.use("/swagger", swaggerUi.serve, swaggerUi.setup(swaggerDoc));

router.get("/account", getAllAccount);
router.get("/account/:id", getAccount);
router.get("/account/:email/:password", getLogin);
// router.post("/login", addAccount);
// router.put("/login/:id", updateAccount);
// router.delete("/login/:id", deleteAccount);

module.exports = {
  routes: router,
};
