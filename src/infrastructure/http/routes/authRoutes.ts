import express from "express";
import { PrismaClient } from "@prisma/client";
import { PrismaUsuarioRepository } from "../../database/PrismaUsuarioRepository.js";
import { PasswordHasher } from "../../security/PasswordHasher.js";
import { JwtService } from "../../security/JwtService.js";
import { RegistrarUsuarioUseCase } from "../../../application/use-cases/auth/RegistrarUsuarioUseCase.js";
import { LoginUseCase } from "../../../application/use-cases/auth/LoginUseCase.js";
import { ObterUsuarioAutenticadoUseCase } from "../../../application/use-cases/auth/ObterUsuarioAutenticadoUseCase.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";

const router = express.Router();
const prisma = new PrismaClient();
const usuarioRepository = new PrismaUsuarioRepository(prisma);
const passwordHasher = new PasswordHasher();
const jwtService = new JwtService();

const registrarUsuarioUseCase = new RegistrarUsuarioUseCase(
  usuarioRepository,
  passwordHasher,
);
const loginUseCase = new LoginUseCase(
  usuarioRepository,
  passwordHasher,
  jwtService,
);
const obterUsuarioAutenticadoUseCase = new ObterUsuarioAutenticadoUseCase(
  usuarioRepository,
);

router.post("/auth/register", async (req, res) => {
  try {
    const { nome, email, senha, tipoPerfil, escolaId } = req.body ?? {};

    if (!nome || !email || !senha || !tipoPerfil) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "Nome, email, senha e tipoPerfil são obrigatórios",
      });
    }

    const resultado = await registrarUsuarioUseCase.execute({
      nome,
      email,
      senha,
      tipoPerfil,
      escolaId,
    });

    return res.status(201).json({
      message: "Usuário registrado com sucesso",
      usuario: resultado,
    });
  } catch (error: any) {
    console.error("Erro ao registrar usuário:", error);

    if (
      error instanceof Error &&
      (error.message.includes("Email já cadastrado") ||
        error.message.includes("Senha fraca") ||
        error.message.includes("Email inválido") ||
        error.message.includes("Tipo de perfil inválido"))
    ) {
      return res.status(400).json({
        error: "Dados inválidos",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao registrar usuário",
      message: "Erro interno do servidor",
    });
  }
});

router.post("/auth/login", async (req, res) => {
  try {
    const { email, senha } = req.body ?? {};

    if (!email || !senha) {
      return res.status(400).json({
        error: "Dados incompletos",
        message: "Email e senha são obrigatórios",
      });
    }

    const resultado = await loginUseCase.execute({ email, senha });

    return res.status(200).json({
      message: "Login realizado com sucesso",
      ...resultado,
    });
  } catch (error: any) {
    console.error("Erro ao fazer login:", error);

    if (
      error instanceof Error &&
      error.message.includes("Email ou senha inválidos")
    ) {
      return res.status(401).json({
        error: "Credenciais inválidas",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao fazer login",
      message: "Erro interno do servidor",
    });
  }
});


router.get("/auth/me", authMiddleware, async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({
        error: "Não autenticado",
        message: "Token inválido ou expirado",
      });
    }

    const usuario = await obterUsuarioAutenticadoUseCase.execute(
      req.user.userId,
    );

    return res.status(200).json({
      usuario,
    });
  } catch (error: any) {
    console.error("Erro ao obter usuário autenticado:", error);

    if (error instanceof Error && error.message.includes("não encontrado")) {
      return res.status(404).json({
        error: "Usuário não encontrado",
        message: error.message,
      });
    }

    return res.status(500).json({
      error: "Erro ao obter dados do usuário",
      message: "Erro interno do servidor",
    });
  }
});

export default router;
