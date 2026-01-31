import express from "express";
import authRoutes from "./authRoutes.js";
import usuarioRoutes from "./usuarioRoutes.js";
import criancaRoutes from "./criancaRoutes.js";
import equipeEscolarRoutes from "./equipeEscolarRoutes.js";

const apiRouter = express.Router();


apiRouter.use(authRoutes);


apiRouter.use(usuarioRoutes);
apiRouter.use(criancaRoutes);
apiRouter.use(equipeEscolarRoutes);

export default apiRouter;
