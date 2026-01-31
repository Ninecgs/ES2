import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaCriancaRepository } from "../../database/PrismaCriancaRepository.js";
import { PrismaUsuarioRepository } from "../../database/PrismaUsuarioRepository.js";
import { CriarCriancaUseCase } from "../../../application/use-cases/CriarCriancaUseCase.js";
import { VisualizarCriancaUseCase } from "../../../application/use-cases/VisualizarCriancaUseCase.js";
import { EditarCriancaUseCase } from "../../../application/use-cases/ManterPerfilCriancaUseCase.js";
import { ExcluirCriancaUseCase } from "../../../application/use-cases/ExcluirCriancaUseCase.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();
const criancaRepo = new PrismaCriancaRepository(prisma);
const usuarioRepo = new PrismaUsuarioRepository(prisma);

const criarCriancaUseCase = new CriarCriancaUseCase(criancaRepo, usuarioRepo);
const visualizarCriancaUseCase = new VisualizarCriancaUseCase(criancaRepo, usuarioRepo);
const editarCriancaUseCase = new EditarCriancaUseCase(criancaRepo, usuarioRepo);
const excluirCriancaUseCase = new ExcluirCriancaUseCase(criancaRepo, usuarioRepo);

router.post("/perfis/criancas", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    const { dataNascimento, grauTEA, grauSuporte, escolaId, responsavelIds } = req.body ?? {};

    if (!dataNascimento || !grauTEA || !grauSuporte) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "dataNascimento, grauTEA e grauSuporte são obrigatórios",
      });
    }

    const criancaId = await criarCriancaUseCase.execute({
      usuarioId: req.user.userId,
      dataNascimento: new Date(dataNascimento),
      grauTEA,
      grauSuporte,
      escolaId,
      responsavelIds,
    });

    return res.status(201).json({
      message: "Criança cadastrada com sucesso",
      criancaId,
    });
  } catch (error: any) {
    console.error("Erro ao criar criança:", error);

    if (
      error instanceof Error &&
      (error.message.includes("Permissão negada") ||
        error.message.includes("obrigatório") ||
        error.message.includes("inválid"))
    ) {
      return res.status(400).json({
        error: "Dados inválidos",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao criar criança",
      message: "Erro interno do servidor",
    });
  }
});

router.get("/perfis/criancas", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    const criancas = await visualizarCriancaUseCase.listarPorUsuario(req.user.userId);

    return res.status(200).json({
      criancas,
    });
  } catch (error: any) {
    console.error("Erro ao listar crianças:", error);

    return res.status(500).json({
      error: "Erro ao listar crianças",
      message: "Erro interno do servidor",
    });
  }
});

router.get("/perfis/criancas/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        error: "ID inválido",
        message: "ID da criança é obrigatório",
      });
    }

    const crianca = await visualizarCriancaUseCase.execute(req.user.userId, id);

    return res.status(200).json({
      crianca,
    });
  } catch (error: any) {
    console.error("Erro ao visualizar criança:", error);

    if (
      error instanceof Error &&
      error.message.includes("não encontrad")
    ) {
      return res.status(404).json({
        error: "Não encontrado",
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message.includes("Permissão negada")
    ) {
      return res.status(403).json({
        error: "Acesso negado",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao visualizar criança",
      message: "Erro interno do servidor",
    });
  }
});

router.put("/perfis/criancas/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        error: "ID inválido",
        message: "ID da criança é obrigatório",
      });
    }

    const { dataNascimento, grauTEA, grauSuporte, escolaId, responsavelIds } = req.body ?? {};

    const input: any = {
      usuarioId: req.user.userId,
      criancaId: id,
    };

    if (dataNascimento) {
      input.dataNascimento = new Date(dataNascimento);
    }

    if (grauTEA) {
      input.grauTEA = grauTEA;
    }

    if (grauSuporte) {
      input.grauSuporte = grauSuporte;
    }

    if (escolaId !== undefined) {
      input.escolaId = escolaId;
    }

    if (responsavelIds !== undefined) {
      input.responsavelIds = responsavelIds;
    }

    await editarCriancaUseCase.execute(input);

    return res.status(200).json({
      message: "Criança atualizada com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao editar criança:", error);

    if (
      error instanceof Error &&
      error.message.includes("não encontrad")
    ) {
      return res.status(404).json({
        error: "Não encontrado",
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message.includes("Permissão negada")
    ) {
      return res.status(403).json({
        error: "Acesso negado",
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message.includes("inválid")
    ) {
      return res.status(400).json({
        error: "Dados inválidos",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao editar criança",
      message: "Erro interno do servidor",
    });
  }
});

router.delete("/perfis/criancas/:id", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        error: "ID inválido",
        message: "ID da criança é obrigatório",
      });
    }

    await excluirCriancaUseCase.execute(req.user.userId, id);

    return res.status(200).json({
      message: "Criança excluída com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao excluir criança:", error);

    if (
      error instanceof Error &&
      error.message.includes("não encontrad")
    ) {
      return res.status(404).json({
        error: "Não encontrado",
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message.includes("Permissão negada")
    ) {
      return res.status(403).json({
        error: "Acesso negado",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao excluir criança",
      message: "Erro interno do servidor",
    });
  }
});

export default router;
