const express = require("express");
const router = express.Router();
const collaboratorController = require("../controllers/collaboratorController");

router.post("/create", collaboratorController.createCollaborator);
router.get("/all", collaboratorController.getAllCollaborators);
router.delete("/delete/:id", collaboratorController.deleteCollaborator);

module.exports = router;
