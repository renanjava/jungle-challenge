![Node.js](https://img.shields.io/badge/node.js-v20.12.2-green) ![NestJS](https://img.shields.io/badge/NestJS-v10.0.0-red) ![Vue.js](https://img.shields.io/badge/Vue.js-v3.4.0-brightgreen) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v16-blue) ![Docker](https://img.shields.io/badge/Docker-enabled-blue) ![Test Coverage](https://img.shields.io/badge/coverage-80%25-brightgreen)

# Jungle Challenge — Sistema de Gestão de Tarefas Colaborativo

## 📌 Visão geral

Este repositório contém um monorepo com um sistema de gestão de tarefas colaborativo (desafio Full‑stack Júnior). A arquitetura é composta por um API Gateway, microserviços (auth, tasks, notifications com WebSocket), um frontend React (Vite + shadcn/ui + Tailwind) e infraestrutura via Docker Compose com RabbitMQ e PostgreSQL.

## 🔍 Diagramas (Mermaid)

Sequência simplificada do fluxo de criação/entrega de notificação:

```mermaid
sequenceDiagram
    participant Client
    participant APIGateway as API Gateway
    participant Tasks as Tasks Service
    participant Rabbit as RabbitMQ
    participant Notifications as Notifications Service
    participant WSClients as WebSocket Clients

    Client->>APIGateway: POST /api/tasks (create)
    APIGateway->>Tasks: RPC/HTTP create task
    Tasks->>Rabbit: emit task.created
    Rabbit->>Notifications: deliver event
    Notifications->>Notifications: persist notification
    Notifications->>WSClients: websocket emit (user rooms / task room)
    WSClients->>Client: mostra notificação em tempo real
```

Arquitetura de alto nível (camadas):

```mermaid
flowchart LR
  subgraph Infra
    DB[(Postgres)]
    MQ[(RabbitMQ)]
  end

  subgraph Backend
    APIGW["API Gateway (NestJS)"]
    AUTH["Auth Service"]
    TASKS["Tasks Service"]
    NOTIF["Notifications Service"]
  end

  subgraph Frontend
    WEB["Web App (React + Vite)"]
  end

  DEVELOPERS["Developers"]

  WEB -->|HTTP| APIGW
  APIGW -->|RPC / HTTP| AUTH
  APIGW -->|RPC / HTTP| TASKS
  TASKS -->|emit event| MQ
  MQ -->|consume| NOTIF
  NOTIF -->|persist| DB
  NOTIF -->|websocket| WEB
  APIGW -->|swagger/docs| DEVELOPERS
  DB ---|store| APIGW
```

---

## 🚀 Tecnologias principais

- Backend: NestJS (TypeScript), TypeORM, RabbitMQ (microservices) e WebSocket Server
- Frontend: React, Vite, TanStack Router, TanStack Query, shadcn/ui, Tailwind CSS, Context API, Zod, React-Hook-Form, WebSocket client, react toaster e react skeleton loader
- Banco: PostgreSQL
- Infra: Docker & docker-compose, Turborepo (monorepo), Github Actions CI/CD

---

## 🗂 Estrutura do monorepo

```plaintext
.
├── apps/
│   ├── web/
│   ├── api-gateway/
│   ├── auth-service/
│   ├── tasks-service/
│   └── notification-service/
├── packages/
│   ├── shared-config/
│   ├── shared-dtos/
│   └── shared-logger/
├── docker-compose.yml
└── README.md
```

---

## 🎯 Funcionalidades (resumo)

- Autenticação (JWT, access/refresh tokens)
- CRUD de tasks com comentários e atribuições múltiplas
- Notificações em tempo real via WebSocket (room per-user e por-task)
- Processamento assíncrono via RabbitMQ (event-driven)
- Admin/Swagger exposto no API Gateway
- Docker Compose para subir todos os serviços

---

## 📡 Endpoints principais (API Gateway)

Autenticação

- POST /api/auth/register
- POST /api/auth/login
- POST /api/auth/refresh

Tasks

- GET /api/tasks
- GET /api/tasks/:id
- POST /api/tasks
- PUT /api/tasks/:id
- DELETE /api/tasks/:id

Comments

- POST /api/tasks/:id/comments
- GET /api/tasks/:id/comments

> Observação: para rotas completas e dados de query/response, utilize o Swagger exposto pelo API Gateway.

---

## 🔔 Eventos WebSocket

- task:created — Tarefa criada
- task:updated — Tarefa atualizada
- comment:new — Novo comentário
- notification — evento genérico de notificação (payload com tipo)

O gateway WebSocket autentica via JWT no handshake e registra cada socket no room `user:{userId}`. Para páginas de tarefa a rota cliente pode entrar no room `task:{taskId}` para receber broadcasts por tarefa.

---

## 🐳 Executando com Docker Compose (recomendado)

Pré-requisitos:

- Docker Desktop ativo

Na raiz do projeto:

```bash
docker-compose up --build
```

Serviços típicos e portas:

- Frontend: http://localhost:3000
- API Gateway: http://localhost:3001
- RabbitMQ Management: http://localhost:15672 (user: admin / pass: admin)
- Postgres: 5432

---

## ⚙️ Variáveis de ambiente

Crie `.env` na raiz do packages/shared-config

```env
API_GATEWAY_PORT=3001
NODE_ENV=development
JWT_ACCESS_SECRET=cafecomleite1
JWT_REFRESH_SECRET=cafecomleite2

LOG_LEVEL=info

DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
AUTH_DB_NAME=auth_db
TASKS_DB_NAME=tasks_db
NOTIFICATION_DB_NAME=notification_db

RABBITMQ_URL="amqp://admin:admin@localhost:5672"

```

---

## 🧭 Decisões técnicas & trade‑offs

- Expondo apenas a API Gateway e o WebSocket server com portas HTTP, o restante dos serviços a comunicação é feita apenas via RabbitMQ, porque eu aproveito a segurança da API Gateway e evito duplicar código nos outros serviços de implementação de JWT e Rate Limiting

---

## ⚠️ Problemas conhecidos e melhorias futuras

- Health checks está verificando apenas a saúde da api gateway e não dos demais serviços, banco e broker.
- Não foi centralizado o refresh token automático quando o access token expira, é feito apenas na listagem das tasks e comentários
- Não foi implementado o reset de senha
- Não possui scroll na listagem dos comentários, então se houver muitos, irá ficar cortado
- Filtro de prioridade e status não funciona corretamente quando há muitas tasks cadastradas, isso por conta da paginação e porque não implementei filtro no lado do back-end
- Testes unitários não cobrem e não testam todas as regras de negócio dos serviços e da API Gateway, apenas o básico como a validação do rate limiting
- Ao varrer os usuários para enviar notificação através do web socket, há chance de receber 429 pois ele tenta buscar e envia varias requisições procurando os usuários

---

## ✅ Testes e CI

- Testes unitários com Jest (backend)
- GitHub Actions para rodar teste, build e lint em cada commit

---

## 🧾 Auditoria / Logs

- Logging centralizado com Pino (JSON) para integração com ELK/CloudWatch.
- Interceptor para audit log para rastrear todas as mudanças envolvendo as tarefas.

---

## 🕒 Registro de horas — 13 dias (template)

Preencha abaixo com descrição do que foi feito e o tempo gasto por dia. Exemplo preenchido com base nas suas anotações iniciais.

| Dia | Data | Descrição (resumo)                                          | Tempo gasto (h) |
| --: | :--: | :---------------------------------------------------------- | :-------------: |
|   1 |      | Setup do monorepo (turborepo, pnpm) — configuração inicial  |       0.0       |
|   2 |      | Estrutura de pastas, setup TypeScript (tsconfig base)       |       0.0       |
|   3 |      | Docker Compose inicial e Dockerfiles (multi-stage)          |       0.0       |
|   4 |      | Criar API Gateway (NestJS) e integrar Swagger               |       0.0       |
|   5 |      | Auth service: JWT, bcrypt e integração com Gateway          |       0.0       |
|   6 |      | Tasks service: entidades, TypeORM e endpoints CRUD          |       0.0       |
|   7 |      | RabbitMQ: filas, eventos (task.created/task.updated)        |       0.0       |
|   8 |      | Notifications service: consumer + persiste notificações     |       0.0       |
|   9 |      | WebSocket Gateway e rooms (user/task)                       |       0.0       |
|  10 |      | Frontend (React + Vite + shadcn + Tailwind) — layout e auth |       0.0       |
|  11 |      | Integração WebSocket no frontend e toasts de notificação    |       0.0       |
|  12 |      | Testes unitários iniciais e CI (GitHub Actions)             |       0.0       |
|  13 |      | Ajustes, bugfixes, documentação e finalização               |       0.0       |

## Total: 00.0 h

## 🧪 Como rodar testes

```bash
cd apps/api-gateway
pnpm install
pnpm run test
```

---

## 📌 Checklist do que entregar no desafio

- Repositório com monorepo funcional (apps + packages)
- Docker Compose que sobe todos os serviços (db + rabbitmq)
- Auth (register/login/refresh) + guards
- CRUD de tasks + comments
- Notificações via RabbitMQ + WebSocket
- README com instruções claras e diagramas (este arquivo)

---

## 👨‍💻 Autor / Contato

- GitHub: [@renanjava](https://github.com/renanjava)
- LinkedIn: [Renan Geraldini Leão](https://www.linkedin.com/in/renan-g-l/)
- Email: renanleao.f90@hotmail.com
