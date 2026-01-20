import express, { type Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import "dotenv/config";

//------------------------------------------------------------------
/**
 * SOLID: SRP (Single Responsibility Principle)
 * Esta classe tem UMA responsabilidade: configurar e iniciar o servidor
 */
class Server {
  private app: Express;
  private port: number;

  constructor(port: number) {
    this.app = express();
    this.port = port;
    this.setupMiddlewares();
    this.setupRoutes();
  }

  /**
   * SRP: Middlewares separados em método próprio
   */
  private setupMiddlewares(): void {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    
    // Servir arquivos estáticos
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    this.app.use(express.static(path.join(__dirname, 'public')));
  }

  /**
   * SRP: Rotas separadas em método próprio
   * OCP: Aberto para extensão (adicionar rotas), fechado para modificação
   */
  private setupRoutes(): void {
    // Health check
    this.app.get('/api/health', (req, res) => {
      res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString() 
      });
    });

    // Fallback para SPA
    this.app.use((req, res) => {
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }

  /**
   * Interface pública clara
   */
  public start(): void {
    this.app.listen(this.port, () => {
      console.log(`SAPEA Server`);
      console.log(`API: http://localhost:${this.port}/api`);
      console.log(`Frontend: http://localhost:${this.port}`);
    });
  }

  /**
   * Permite acesso ao app para testes (DIP - Dependency Inversion)
   */
  public getApp(): Express {
    return this.app;
  }
}

// Bootstrap
const PORT = Number(process.env.PORT) || 3000;
const server = new Server(PORT);
server.start();