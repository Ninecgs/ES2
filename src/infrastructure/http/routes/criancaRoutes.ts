import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaCriancaRepository } from "../../database/PrismaCriancaRepository.js";
import {
  inMemoryEventoRepository,
  inMemoryAmbienteEscolarRepository,
} from "../../database/inMemoryRepositories.js";
import { SolicitarSuporteUseCase } from "../../../application/use-cases/SolicitarSuporteUseCase.js";
import { VisualizarCalendarioUseCase } from "../../../application/use-cases/VisualizarCalendarioUseCase.js";
import { VisualizarAmbienteEscolarUseCase } from "../../../application/use-cases/VisualizarAmbienteEscolarUseCase.js";

const router = express.Router();

const prisma = new PrismaClient();
const criancaRepo = new PrismaCriancaRepository(prisma);
const eventoRepo = inMemoryEventoRepository;
const ambienteRepo = inMemoryAmbienteEscolarRepository;

const solicitarSuporteUseCase = new SolicitarSuporteUseCase(criancaRepo);
const visualizarCalendarioUseCase = new VisualizarCalendarioUseCase(
  criancaRepo,
  eventoRepo,
);
const visualizarAmbienteEscolarUseCase = new VisualizarAmbienteEscolarUseCase(
  criancaRepo,
  ambienteRepo,
);

router.post("/criancas/:id/suporte", async (req, res) => {
  const { id } = req.params;

  try {
    await solicitarSuporteUseCase.execute(id);
    return res.status(201).json({
      message: "Pedido de suporte registrado com sucesso.",
      criancaId: id,
    });
  } catch (err: any) {
    if (err instanceof Error && err.message === "Criança não encontrada") {
      return res.status(404).json({ error: err.message });
    }

    console.error("Erro ao solicitar suporte:", err);
    return res.status(500).json({
      error: "Erro ao processar solicitação de suporte.",
    });
  }
});

router.get("/criancas/:id/calendario", async (req, res) => {
  const { id } = req.params;

  try {
    const eventos = await visualizarCalendarioUseCase.execute(id);
    return res.status(200).json({
      criancaId: id,
      eventos,
    });
  } catch (err: any) {
    if (err instanceof Error && err.message === "Criança não encontrada") {
      return res.status(404).json({ error: err.message });
    }

    console.error("Erro ao visualizar calendário:", err);
    return res.status(500).json({
      error: "Erro ao buscar calendário da criança.",
    });
  }
});

router.get("/criancas/:id/ambientes", async (req, res) => {
  const { id } = req.params;

  try {
    const ambientes = await visualizarAmbienteEscolarUseCase.execute(id);
    return res.status(200).json({
      criancaId: id,
      ambientes,
    });
  } catch (err: any) {
    if (err instanceof Error && err.message === "Criança não encontrada") {
      return res.status(404).json({ error: err.message });
    }

    console.error("Erro ao visualizar ambientes:", err);
    return res.status(500).json({
      error: "Erro ao buscar ambientes escolares para a criança.",
    });
  }
});

export default router;
