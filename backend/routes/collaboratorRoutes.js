const express = require("express");
const {
  addCollaborator,
  getCollaborators,
} = require("../controllers/collaboratorController");
const router = express.Router();

router.post("/", addCollaborator);
router.get("/", getCollaborators);

module.exports = router;
