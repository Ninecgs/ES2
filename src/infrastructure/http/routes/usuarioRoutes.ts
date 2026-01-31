import express from "express";

const router = express.Router();

// Exemplo de rotas relacionadas a usuários.
// Estas rotas estão simples de propósito, para servir como modelo.

// GET /usuarios - listar usuários (placeholder)
router.get("/usuarios", (req, res) => {
  res.json({
    message: "Listar usuários ainda não implementado.",
  });
});

// GET /usuarios/:id - obter um usuário específico (placeholder)
router.get("/usuarios/:id", (req, res) => {
  const { id } = req.params;
  res.json({
    message: "Detalhes de usuário ainda não implementado.",
    id,
  });
});

export default router;
