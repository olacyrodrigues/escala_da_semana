const Collaborator = require("../models/collaborator");

exports.createCollaborator = async (req, res) => {
  try {
    const { sector, employee, contact, timeIn, timeOut, day } = req.body;
    const newCollaborator = await Collaborator.create({
      sector,
      employee,
      contact,
      timeIn,
      timeOut,
      day,
    });
    res.json(newCollaborator);
  } catch (error) {
    console.error("Erro ao criar colaborador:", error);
    res.status(500).json({ error: "Erro ao criar colaborador." });
  }
};

exports.getAllCollaborators = async (req, res) => {
  try {
    const collaborators = await Collaborator.findAll();
    res.json(collaborators);
  } catch (error) {
    console.error("Erro ao buscar colaboradores:", error);
    res.status(500).json({ error: "Erro ao buscar colaboradores." });
  }
};

exports.deleteCollaborator = async (req, res) => {
  try {
    const { id } = req.params;
    await Collaborator.destroy({ where: { id } });
    res.json({ message: "Colaborador removido com sucesso." });
  } catch (error) {
    console.error("Erro ao remover colaborador:", error);
    res.status(500).json({ error: "Erro ao remover colaborador." });
  }
};
