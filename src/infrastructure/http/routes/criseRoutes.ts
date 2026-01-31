import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaCriancaRepository } from "../../database/PrismaCriancaRepository.js";
import { ManterHistoricoCriseUseCase } from "../../../application/use-cases/equipeEscolar/ManterHistoricoCriseUseCase.js";
import { VisualizarHistoricoCriseUseCase } from "../../../application/use-cases/VisualizarHistoricoCriseUseCase.js";
import { SolicitarSuporteUseCase } from "../../../application/use-cases/SolicitarSuporteUseCase.js";
import { NotificacaoService } from "../../services/NotificacaoService.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();
const criancaRepository = new PrismaCriancaRepository(prisma);
const notificacaoService = new NotificacaoService();

const manterHistoricoCriseUseCase = new ManterHistoricoCriseUseCase(
  criancaRepository,
);
const visualizarHistoricoCriseUseCase = new VisualizarHistoricoCriseUseCase(
  criancaRepository,
);
const solicitarSuporteUseCase = new SolicitarSuporteUseCase(criancaRepository, notificacaoService);

router.post("/crises", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    if (req.user.tipoPerfil !== "EQUIPE_ESCOLAR") {
      return res.status(403).json({
        error: "Acesso negado",
        message: "Apenas membros da equipe escolar podem registrar crises",
      });
    }

    const { criancaId, dataHora, intensidade, descricao, gatilhoIdentificado } =
      req.body ?? {};

    if (!criancaId || !dataHora || !intensidade) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "criancaId, dataHora e intensidade são obrigatórios",
      });
    }

    await manterHistoricoCriseUseCase.registrarCrise({
      criancaId,
      dataHora: new Date(dataHora),
      intensidade,
      descricao,
      gatilhoIdentificado,
    });

    return res.status(201).json({
      message: "Crise registrada com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao registrar crise:", error);

    if (
      error instanceof Error &&
      (error.message.includes("não encontrada") ||
        error.message.includes("não encontrado"))
    ) {
      return res.status(404).json({
        error: "Criança não encontrada",
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      (error.message.includes("já existe") ||
        error.message.includes("em andamento") ||
        error.message.includes("futura") ||
        error.message.includes("Intensidade inválida"))
    ) {
      return res.status(400).json({
        error: "Dados inválidos",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao registrar crise",
      message: "Erro interno do servidor",
    });
  }
});

router.post("/intervencoes", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    if (req.user.tipoPerfil !== "EQUIPE_ESCOLAR") {
      return res.status(403).json({
        error: "Acesso negado",
        message: "Apenas membros da equipe escolar podem registrar intervenções",
      });
    }

    const { criancaId, dataHora, estrategia, aplicadaPor, resultado } =
      req.body ?? {};

    if (!criancaId || !dataHora || !estrategia || !aplicadaPor) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "criancaId, dataHora, estrategia e aplicadaPor são obrigatórios",
      });
    }

    await manterHistoricoCriseUseCase.registrarIntervencao({
      criancaId,
      dataHora: new Date(dataHora),
      estrategia,
      aplicadaPor,
      resultado,
    });

    return res.status(201).json({
      message: "Intervenção registrada com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao registrar intervenção:", error);

    if (
      error instanceof Error &&
      (error.message.includes("não encontrada") ||
        error.message.includes("não encontrado"))
    ) {
      return res.status(404).json({
        error: "Criança não encontrada",
        message: error.message,
      });
    }

    if (
      error instanceof Error &&
      error.message.includes("obrigatório")
    ) {
      return res.status(400).json({
        error: "Dados inválidos",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao registrar intervenção",
      message: "Erro interno do servidor",
    });
  }
});

router.patch("/crises/:id/eficacia", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    if (req.user.tipoPerfil !== "EQUIPE_ESCOLAR") {
      return res.status(403).json({
        error: "Acesso negado",
        message: "Apenas membros da equipe escolar podem marcar eficácia de crises",
      });
    }

    const { id } = req.params;

    if (!id || typeof id !== "string") {
      return res.status(400).json({
        error: "ID inválido",
        message: "ID da crise é obrigatório",
      });
    }

    const { criancaId, eficaz } = req.body ?? {};

    if (!criancaId || eficaz === undefined) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "criancaId e eficaz são obrigatórios",
      });
    }

    await manterHistoricoCriseUseCase.marcarEficaciaCrise({
      criancaId,
      criseId: id,
      eficaz,
    });

    return res.status(200).json({
      message: "Eficácia da crise marcada com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao marcar eficácia:", error);

    if (
      error instanceof Error &&
      (error.message.includes("não encontrada") ||
        error.message.includes("não encontrado"))
    ) {
      return res.status(404).json({
        error: "Não encontrado",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao marcar eficácia",
      message: "Erro interno do servidor",
    });
  }
});

router.get("/crises/crianca/:criancaId", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    const { criancaId } = req.params;

    if (!criancaId || typeof criancaId !== "string") {
      return res.status(400).json({
        error: "ID inválido",
        message: "ID da criança é obrigatório",
      });
    }

    const crises = await visualizarHistoricoCriseUseCase.execute(criancaId);

    return res.status(200).json({
      crises,
    });
  } catch (error: any) {
    console.error("Erro ao listar crises:", error);

    if (
      error instanceof Error &&
      error.message.includes("não encontrada")
    ) {
      return res.status(404).json({
        error: "Criança não encontrada",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao listar crises",
      message: "Erro interno do servidor",
    });
  }
});

router.post("/suporte", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Autenticação necessária",
      });
    }

    const { criancaId } = req.body ?? {};

    if (!criancaId) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "criancaId é obrigatório",
      });
    }

    await solicitarSuporteUseCase.execute(criancaId);

    return res.status(201).json({
      message: "Suporte solicitado com sucesso",
    });
  } catch (error: any) {
    console.error("Erro ao solicitar suporte:", error);

    if (
      error instanceof Error &&
      error.message.includes("não encontrada")
    ) {
      return res.status(404).json({
        error: "Criança não encontrada",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao solicitar suporte",
      message: "Erro interno do servidor",
    });
  }
});

export default router;
