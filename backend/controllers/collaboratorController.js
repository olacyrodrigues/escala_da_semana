const Collaborator = require("../models/collaborator");

async function addCollaborator(req, res) {
  try {
    const collaborator = await Collaborator.create(req.body);
    res.status(201).json(collaborator);
  } catch (error) {
    res.status(400).json({ error: "Failed to add collaborator" });
  }
}

async function getCollaborators(req, res) {
  const collaborators = await Collaborator.findAll();
  res.status(200).json(collaborators);
}

module.exports = { addCollaborator, getCollaborators };
