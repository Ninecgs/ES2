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

## Execução

Inicie o servidor em modo de desenvolvimento:
```bash
npm run dev
```

## Estrutura do Projeto

```
src/
├── server.ts              # Ponto de entrada da aplicação
├── application/           # Casos de uso e DTOs
├── domain/                # Entidades e repositórios
├── infra/                 # Configurações e serviços
├── presentation/          # Controllers, middlewares e rotas
└── public/                # Arquivos estáticos
```
