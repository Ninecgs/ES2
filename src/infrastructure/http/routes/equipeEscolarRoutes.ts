import express from "express";
import {
  inMemoryEventoRepository,
  inMemoryAmbienteEscolarRepository,
} from "../../database/inMemoryRepositories.js";
import {
  ManterCalendarioUseCase,
  type CriarEventoCalendarioInput,
  type AtualizarEventoCalendarioInput,
} from "../../../application/use-cases/equipeEscolar/ManterCalendarioUseCase.js";
import {
  ManterAmbienteEscolarUseCase,
  type CriarAmbienteEscolarInput,
  type AtualizarAmbienteEscolarInput,
} from "../../../application/use-cases/equipeEscolar/ManterAmbienteEscolarUseCase.js";

const router = express.Router();

// Repositórios em memória compartilhados para calendário e ambientes.
// Em produção, estes seriam substituídos por implementações baseadas em banco de dados.
const eventoRepo = inMemoryEventoRepository;
const ambienteRepo = inMemoryAmbienteEscolarRepository;

const manterCalendarioUseCase = new ManterCalendarioUseCase(eventoRepo);
const manterAmbienteEscolarUseCase = new ManterAmbienteEscolarUseCase(
  ambienteRepo,
);

// --- Rotas de calendário escolar (equipe escolar) ---

// POST /equipe-escolar/criancas/:criancaId/eventos
// Cria um evento no calendário da criança.
router.post("/equipe-escolar/criancas/:criancaId/eventos", async (req, res) => {
  const { criancaId } = req.params;
  const { titulo, dataHoraInicio, dataHoraFim, nivelRisco } = req.body ?? {};

  try {
    const input: CriarEventoCalendarioInput = {
      criancaId,
      titulo,
      dataHoraInicio: new Date(dataHoraInicio),
      dataHoraFim: new Date(dataHoraFim),
      nivelRisco,
    };

    await manterCalendarioUseCase.criar(input);

    return res.status(201).json({
      message: "Evento criado com sucesso.",
      criancaId,
    });
  } catch (err: any) {
    console.error("Erro ao criar evento de calendário:", err);
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Erro ao criar evento.",
    });
  }
});

// PUT /equipe-escolar/eventos/:eventoId
// Atualiza um evento existente do calendário.
router.put("/equipe-escolar/eventos/:eventoId", async (req, res) => {
  const { eventoId } = req.params;
  const { titulo, dataHoraInicio, dataHoraFim, nivelRisco } = req.body ?? {};

  try {
    const input: AtualizarEventoCalendarioInput = {
      eventoId,
      titulo,
      dataHoraInicio: dataHoraInicio ? new Date(dataHoraInicio) : undefined,
      dataHoraFim: dataHoraFim ? new Date(dataHoraFim) : undefined,
      nivelRisco,
    };

    await manterCalendarioUseCase.atualizar(input);

    return res.status(200).json({
      message: "Evento atualizado com sucesso.",
      eventoId,
    });
  } catch (err: any) {
    if (err instanceof Error && err.message.includes("não encontrado")) {
      return res.status(404).json({ error: err.message });
    }

    console.error("Erro ao atualizar evento de calendário:", err);
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Erro ao atualizar evento.",
    });
  }
});

// DELETE /equipe-escolar/eventos/:eventoId
// Remove um evento do calendário.
router.delete("/equipe-escolar/eventos/:eventoId", async (req, res) => {
  const { eventoId } = req.params;

  try {
    await manterCalendarioUseCase.excluir(eventoId);

    return res.status(204).send();
  } catch (err: any) {
    console.error("Erro ao excluir evento de calendário:", err);
    return res.status(400).json({
      error: err instanceof Error ? err.message : "Erro ao excluir evento.",
    });
  }
});

// --- Rotas de ambientes escolares (equipe escolar) ---

// POST /equipe-escolar/escolas/:escolaId/ambientes
// Cria um novo ambiente escolar associado a uma escola.
router.post("/equipe-escolar/escolas/:escolaId/ambientes", async (req, res) => {
  const { escolaId } = req.params;
  const { nome, descricao, midias } = req.body ?? {};

  try {
    const input: CriarAmbienteEscolarInput = {
      escolaId,
      nome,
      descricao,
      midias,
    };

    const ambiente = await manterAmbienteEscolarUseCase.criar(input);

    return res.status(201).json({
      message: "Ambiente escolar criado com sucesso.",
      ambiente: {
        id: ambiente.id,
        escolaId: ambiente.escolaId,
        nome: ambiente.nome,
        descricao: ambiente.descricao ?? undefined,
        midias: ambiente.midias ?? undefined,
      },
    });
  } catch (err: any) {
    console.error("Erro ao criar ambiente escolar:", err);
    return res.status(400).json({
      error:
        err instanceof Error ? err.message : "Erro ao criar ambiente escolar.",
    });
  }
});

// PUT /equipe-escolar/ambientes/:ambienteId
// Atualiza um ambiente escolar existente.
router.put("/equipe-escolar/ambientes/:ambienteId", async (req, res) => {
  const { ambienteId } = req.params;
  const { nome, descricao, midias } = req.body ?? {};

  try {
    const input: AtualizarAmbienteEscolarInput = {
      ambienteId,
      nome,
      descricao,
      midias,
    };

    const ambiente = await manterAmbienteEscolarUseCase.atualizar(input);

    return res.status(200).json({
      message: "Ambiente escolar atualizado com sucesso.",
      ambiente: {
        id: ambiente.id,
        escolaId: ambiente.escolaId,
        nome: ambiente.nome,
        descricao: ambiente.descricao ?? undefined,
        midias: ambiente.midias ?? undefined,
      },
    });
  } catch (err: any) {
    if (err instanceof Error && err.message.includes("não encontrado")) {
      return res.status(404).json({ error: err.message });
    }

    console.error("Erro ao atualizar ambiente escolar:", err);
    return res.status(400).json({
      error:
        err instanceof Error
          ? err.message
          : "Erro ao atualizar ambiente escolar.",
    });
  }
});

// DELETE /equipe-escolar/ambientes/:ambienteId
// Remove um ambiente escolar.
router.delete("/equipe-escolar/ambientes/:ambienteId", async (req, res) => {
  const { ambienteId } = req.params;

  try {
    await manterAmbienteEscolarUseCase.excluir(ambienteId);

    return res.status(204).send();
  } catch (err: any) {
    console.error("Erro ao excluir ambiente escolar:", err);
    return res.status(400).json({
      error:
        err instanceof Error
          ? err.message
          : "Erro ao excluir ambiente escolar.",
    });
  }
});

export default router;
