const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.authenticate = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Credenciais inválidas." });
    }

    res.status(200).json({ message: "Login bem-sucedido!" });
  } catch (error) {
    res.status(500).json({ message: "Erro no servidor." });
  }
};

exports.createUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username: username,
      password: hashedPassword,
    });

    res
      .status(201)
      .json({ message: "Usuário criado com sucesso!", user: user.username });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao criar usuário.", error: error.message });
  }
};

exports.updateUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    user.password = hashedPassword;
    await user.save();

    res.status(200).json({ message: "Usuário atualizado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao atualizar usuário.", error: error.message });
  }
};

exports.deleteUser = async (req, res) => {
  const { username } = req.body;
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado." });
    }

    await user.destroy();
    res.status(200).json({ message: "Usuário deletado com sucesso!" });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao deletar usuário.", error: error.message });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Erro ao buscar usuários.", error: error.message });
  }
};
