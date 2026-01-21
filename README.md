# ES2

## Pré-requisitos

- Node.js (versão 18 ou superior)
- npm

## Preparação do Ambiente

1. Clone o repositório:

```bash
git clone https://github.com/ocaiomnz/ES2.git
cd ES2
```

2. Instale as dependências:

```bash
npm install
```

3. Setup do banco:
```bash
npx prisma generate
npx prisma migrate dev
```

4. Rodar
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── Domain Layer           # Entidades e repositórios
│   ├── Entities (Criança, Evento)
│   ├── Value Objects (Email, NivelRisco)
│   └── Repository Interfaces
│
├── Application Layer      # Casos de uso e DTOs
│   ├── Use Cases
│   └── DTOs
│
├── Infrastructure Layer   # Configurações e serviços
    ├── Database (Prisma)
    ├── HTTP (Express)
    └── Config 
├── presentation/          # Controllers, middlewares e rotas
├── server.ts              # Ponto de entrada da aplicação
└── public/                # Arquivos estáticos
```
