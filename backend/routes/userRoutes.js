const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");

router.post("/login", userController.authenticate);
router.post("/create", userController.createUser);
router.put("/update", userController.updateUser);
router.delete("/delete", userController.deleteUser);
router.get("/all", userController.getAllUsers);
router.post("/logout", userController.logout);

// backend/routes/userRoutes.js
router.post("/reset-inactivity-timer", (req, res) => {
  req.session.lastActivity = Date.now();
  res.sendStatus(200);
});

module.exports = router;
