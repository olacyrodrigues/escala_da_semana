const Collaborator = require("../models/collaborator");

exports.createCollaborator = async (req, res) => {
  try {
    const collaborator = await Collaborator.create(req.body);
    res.status(201).json(collaborator);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar colaborador.", error: error.message });
  }
};

exports.getCollaborators = async (req, res) => {
  try {
    const collaborators = await Collaborator.findAll();
    res.status(200).json(collaborators);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar colaboradores.", error: error.message });
  }
};

exports.deleteCollaborator = async (req, res) => {
  const { id } = req.params;
  try {
    const collaborator = await Collaborator.findByPk(id);
    if (!collaborator) {
      return res.status(404).json({ message: "Colaborador não encontrado." });
    }
    await collaborator.destroy();
    res.status(200).json({ message: "Colaborador removido com sucesso." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao remover colaborador.", error: error.message });
  }
};

exports.deleteOldCollaborators = async () => {
  const now = new Date();
  const lastMonday = new Date(
    now.setDate(now.getDate() - now.getDay() + 1 - 7)
  );
  try {
    await Collaborator.destroy({
      where: {
        createdAt: {
          [Op.lt]: lastMonday,
        },
      },
    });
    console.log("Colaboradores antigos removidos com sucesso.");
  } catch (error) {
    console.error("Erro ao remover colaboradores antigos:", error.message);
  }
};
