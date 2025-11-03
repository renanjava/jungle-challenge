![Node.js](https://img.shields.io/badge/node.js-v18.19.0%20%7C%20v22.20.0-green) ![NestJS](https://img.shields.io/badge/NestJS-v11.1.7-red) ![React](https://img.shields.io/badge/React-v18-blue) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v17.5-blue) ![Docker](https://img.shields.io/badge/Docker-enabled-blue) ![pnpm](https://img.shields.io/badge/pnpm-v9.15.0-orange)

# Jungle Challenge — Sistema de Gestão de Tarefas Colaborativo

## 📌 Visão geral

Este repositório contém um monorepo com um sistema de gestão de tarefas colaborativo (desafio Full-stack Júnior). A arquitetura é composta por um API Gateway, microserviços (auth, tasks, notifications com WebSocket), um frontend React (Vite + shadcn/ui + Tailwind) e infraestrutura via Docker Compose com RabbitMQ e PostgreSQL.

## 📊 Diagramas (Mermaid)

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

### Backend

- **Framework:** NestJS 11.1.7 (TypeScript)
- **ORM:** TypeORM com migrations
- **Message Broker:** RabbitMQ (microservices pattern)
- **WebSocket:** Socket.io para notificações em tempo real
- **Autenticação:** JWT (access + refresh tokens)
- **Validação:** class-validator + class-transformer
- **Logger:** Pino (JSON estruturado, compatível com CloudWatch/ELK)
- **Segurança:** Helmet (XSS protection), Rate Limiting, CORS

### Frontend

- **Framework:** React 18
- **Build Tool:** Vite
- **Routing:** TanStack Router
- **Data Fetching:** TanStack Query (React Query)
- **UI:** shadcn/ui + Tailwind CSS
- **Forms:** React Hook Form + Zod
- **State:** Context API
- **WebSocket Client:** Socket.io-client
- **Notifications:** React Toaster
- **Loading States:** React Skeleton Loader

### Infraestrutura

- **Database:** PostgreSQL 17.5
- **Containerização:** Docker & Docker Compose
- **Monorepo:** Turborepo + pnpm workspaces
- **CI/CD:** GitHub Actions
- **Package Manager:** pnpm 9.15.0 (3x mais rápido que npm)

---

## 🗂 Estrutura do monorepo

```plaintext
.
├── apps/
│   ├── web/                      # Frontend React + Vite
│   ├── api-gateway/              # API Gateway + Swagger + Rate Limiting
│   ├── auth-service/             # Serviço de autenticação
│   ├── tasks-service/            # CRUD de tarefas + audit logs
│   └── notifications-service/    # WebSocket + RabbitMQ consumer
├── packages/
│   ├── shared-config/            # Configurações TypeScript base + env vars
│   ├── shared-dtos/              # DTOs compartilhados (validação)
│   └── shared-logger/            # Logger Pino centralizado
├── db-init/                      # Scripts SQL de inicialização
├── docker-compose.yml
├── turbo.json
└── README.md
```

---

## 🎯 Funcionalidades (resumo)

### Autenticação

- Registro de usuários com criptografia bcrypt
- Login com JWT (access token + refresh token)
- Refresh automático de tokens
- Guards JWT protegendo rotas privadas

### Gestão de Tarefas

- CRUD completo de tasks
- Comentários por tarefa
- Atribuições múltiplas de usuários
- Filtros por status e prioridade
- Busca por título
- Paginação

### Notificações em Tempo Real

- WebSocket com autenticação JWT no handshake
- Rooms per-user (`user:{userId}`)
- Rooms per-task (`task:{taskId}`)
- Eventos: task criada, atualizada, novo comentário
- Toast notifications no frontend

### Auditoria

- Interceptor de audit log para todas mudanças em tasks
- Registro de ações: CREATE, UPDATE, DELETE, STATUS_CHANGE
- Comparação de valores antigos vs novos
- Timestamps e user_id rastreados

### Processamento Assíncrono

- RabbitMQ para comunicação entre microserviços
- Pattern "fire-and-forget" com `emit()`
- Desacoplamento total entre serviços
- Event-driven architecture

---

## 📡 Endpoints principais (API Gateway)

### Autenticação

- `POST /api/auth/register` - Criar novo usuário
- `POST /api/auth/login` - Login (retorna access + refresh tokens)
- `POST /api/auth/refresh` - Renovar access token

### Tasks

- `GET /api/tasks` - Listar tasks (paginado, com filtros)
- `GET /api/tasks/:id` - Buscar task específica
- `POST /api/tasks` - Criar nova task
- `PUT /api/tasks/:id` - Atualizar task
- `DELETE /api/tasks/:id` - Deletar task
- `POST /api/tasks/assignment` - Atribuir usuários à task

### Comentários

- `POST /api/tasks/:id/comments` - Adicionar comentário
- `GET /api/tasks/:id/comments` - Listar comentários da task

### Documentação

- `GET /api-docs` - Swagger UI (disponível no API Gateway)

> **Observação:** Para rotas completas e schemas de request/response, utilize o Swagger exposto em `http://localhost:3001/api-docs`

---

## 🔌 Eventos WebSocket

O servidor WebSocket autentica via JWT no handshake e registra cada cliente em rooms específicos:

### Eventos disponíveis:

- `task:created` — Nova tarefa criada
- `task:updated` — Tarefa atualizada
- `task:assigned` — Usuário atribuído a tarefa
- `comment:new` — Novo comentário adicionado
- `notification` — Evento genérico (payload com tipo)

### Rooms:

- `user:{userId}` — Notificações pessoais do usuário
- `task:{taskId}` — Atualizações específicas de uma tarefa

---

## 🳠Executando com Docker Compose (recomendado)

### Pré-requisitos:

- Docker Desktop ativo
- Portas 3000-3004, 5432, 5672, 15672 disponíveis

### Instalação:

1. **Clone o repositório:**

```bash
git clone https://github.com/renanjava/jungle-challenge
cd jungle-challenge
```

2. **Configure as variáveis de ambiente:**

Crie `.env` na raiz de `packages/shared-config`:

```env
API_GATEWAY_PORT=3001
NODE_ENV=development
JWT_ACCESS_SECRET=cafecomleite1
JWT_REFRESH_SECRET=cafecomleite2

LOG_LEVEL=info

DB_HOST=db
DB_PORT=5432
DB_USER=postgres
DB_PASS=password
AUTH_DB_NAME=auth_db
TASKS_DB_NAME=tasks_db
NOTIFICATION_DB_NAME=notification_db

RABBITMQ_URL="amqp://admin:admin@rabbitmq:5672"
```

3. **Instale as dependencias na raiz do projeto:**

```bash
pnpm install
```

4. **Suba os containers:**

```bash
# Limpar volumes antigos (se necessário)
docker-compose down -v

# Build e start
docker-compose up --build
```

### Serviços e Portas:

| Serviço               | URL                            | Credenciais       |
| --------------------- | ------------------------------ | ----------------- |
| Frontend              | http://localhost:3000          | -                 |
| API Gateway           | http://localhost:3001          | -                 |
| Swagger Docs          | http://localhost:3001/api-docs | -                 |
| Auth Service          | (interno)                      | -                 |
| Tasks Service         | (interno)                      | -                 |
| Notifications Service | (interno)                      | -                 |
| PostgreSQL            | localhost:5432                 | postgres/password |
| RabbitMQ Management   | http://localhost:15672         | admin/admin       |

> **Nota:** Apenas o Frontend, API Gateway e RabbitMQ Management têm portas expostas. Os demais serviços comunicam-se apenas via RabbitMQ.

---

## ⚙️ Desenvolvimento Local (sem Docker)

### Pré-requisitos:

- Node.js 18.19.0 (para serviços NestJS)
- Node.js 22.20.0 (para frontend React)
- pnpm 9.15.0
- PostgreSQL 17.5
- RabbitMQ

### Setup com NVM:

```bash
# Instalar NVM (Node Version Manager)
# Para Windows: https://github.com/coreybutler/nvm-windows

# Instalar versões do Node
nvm install 18.19.0
nvm install 22.20.0

# Para trabalhar no backend
nvm use 18
pnpm install
pnpm run dev:gateway  # ou dev:auth, dev:tasks, dev:notifications

# Para trabalhar no frontend
nvm use 22
pnpm run dev:web
```

### Turborepo Scripts:

```bash
# Instalar todas as dependências
pnpm install

# Desenvolvimento
pnpm run dev               # Roda todos serviços em paralelo
pnpm run dev:gateway       # Apenas API Gateway
pnpm run dev:auth          # Apenas Auth Service
pnpm run dev:tasks         # Apenas Tasks Service
pnpm run dev:notifications # Apenas Notifications Service
pnpm run dev:web           # Apenas Frontend (requer Node 22)

# Build
pnpm run build            # Build de todos os serviços

# Testes
pnpm run test             # Roda todos os testes

# Linting
pnpm run lint             # Verifica código

# Formatação
pnpm run format           # Formata com Prettier
```

---

## 🧭 Decisões técnicas & trade-offs

### Arquitetura

1. **API Gateway como único ponto de entrada HTTP**
   - ✅ Centralização da autenticação JWT
   - ✅ Rate limiting implementado uma vez
   - ✅ Swagger unificado
   - ✅ Menor superfície de ataque
   - ❌ Ponto único de falha (mitigado com health checks)

2. **Comunicação via RabbitMQ**
   - ✅ Desacoplamento total entre serviços
   - ✅ Escalabilidade horizontal facilitada
   - ✅ Event-driven architecture
   - ✅ "Fire-and-forget" para operações não críticas
   - ❌ Complexidade adicional de infraestrutura
   - ❌ Debugging mais difícil

3. **Multi-staged Dockerfile**
   - ✅ Imagens finais menores (apenas runtime necessário)
   - ✅ Separação clara: deps → builder → runner
   - ✅ Cache de layers otimizado
   - ❌ Build time maior

### Monorepo

1. **pnpm + Turborepo**
   - ✅ 3x mais rápido que npm
   - ✅ Cache global compartilhado
   - ✅ Workspaces nativos
   - ✅ Instalação incremental
   - ❌ Curva de aprendizado inicial

2. **Shared packages**
   - ✅ Reutilização de código (config, dtos, logger)
   - ✅ Consistência entre serviços
   - ✅ Manutenção simplificada
   - ❌ Acoplamento em nível de código

### Banco de Dados

1. **Bancos separados por domínio**
   - ✅ Isolamento de dados (auth_db, tasks_db, notifications_db)
   - ✅ Migrations independentes
   - ✅ Facilita escalabilidade
   - ❌ Joins entre domínios impossíveis (por design)

2. **TypeORM sem sync:true**
   - ✅ Migrations controladas manualmente
   - ✅ Versionamento de schema
   - ✅ Segurança contra perda de dados
   - ❌ Mais trabalho manual

### Frontend

1. **TanStack Router + TanStack Query**
   - ✅ Type-safe routing
   - ✅ Cache automático de queries
   - ✅ Estados de loading/error nativos
   - ✅ Retry automático
   - ❌ Biblioteca relativamente nova

2. **Context API para auth**
   - ✅ Simples e nativo do React
   - ✅ Evita prop drilling
   - ✅ Integração fácil com WebSocket
   - ❌ Não é ideal para estados complexos (mas suficiente aqui)

### Segurança

1. **Criptografia de senha na Entity**
   - ✅ Bcrypt antes de save/update
   - ✅ Impossível salvar senha em plain text
   - ✅ Código centralizado
   - ❌ Custo computacional no event listener

2. **UUID ao invés de IDs sequenciais**
   - ✅ Maior segurança (IDs não previsíveis)
   - ✅ Distribuído (não depende de sequence)
   - ❌ Performance marginalmente inferior

### Logging e Auditoria

1. **Pino como logger**
   - ✅ JSON estruturado
   - ✅ Assíncrono (não bloqueia event loop)
   - ✅ Compatível com CloudWatch/ELK
   - ✅ Alta performance
   - ❌ Logs menos "human-readable" sem parser

2. **Interceptor para audit logs**
   - ✅ Não polui código de negócio
   - ✅ Captura antes e depois (UPDATE)
   - ✅ Detecta mudanças de status automaticamente
   - ❌ Adiciona overhead em todas requisições

---

## ⚠️ Problemas conhecidos e melhorias futuras

### Funcionalidades

- [ ] **Health checks incompletos** — Verifica apenas API Gateway, não os demais serviços
- [ ] **Refresh token manual** — Não centralizado, apenas em listagem de tasks/comentários
- [ ] **Reset de senha** — Não implementado
- [ ] **Scroll de comentários** — Interface corta quando há muitos comentários
- [ ] **Filtros de frontend** — Prioridade/status não funciona corretamente com paginação (falta implementar no backend)

### Performance

- [ ] **Busca de usuários para notificação** — Pode causar rate limit 429 ao varrer múltiplos usuários
- [ ] **Paginação de comentários** — Não implementada (carrega todos)
- [ ] **Cache de queries** — Poderia ser mais agressivo

### Qualidade

- [ ] **Cobertura de testes** — Apenas testes básicos (ex: rate limiting)
- [ ] **Testes E2E** — Não implementados
- [ ] **Dados mock do dashboard** — Alguns dados não são reais

### DevOps

- [ ] **Ambiente de staging** — Apenas development e production
- [ ] **Secrets management** — Usar vault em produção
- [ ] **Observabilidade** — Falta integração com Grafana/Prometheus
- [ ] **Backup automático** — Banco de dados não tem estratégia de backup

---

## ✅ Testes e CI

### Testes Unitários

```bash
# Rodar testes do API Gateway
cd apps/api-gateway
pnpm install
pnpm run test
```

### Continuous Integration

GitHub Actions configurado para:

- ✅ Executar todos os testes
- ✅ Verificar build de todos os apps
- ✅ Lint de código
- ✅ Type checking

Workflow ativa em **todo commit** nas branches principais.

---

## 🧾 Auditoria / Logs

### Logger Centralizado (Pino)

- **Formato:** JSON estruturado
- **Nível:** Configurável via `LOG_LEVEL` (info, debug, warn, error)
- **Integração:** Pronto para ELK Stack, AWS CloudWatch, Grafana Loki
- **Performance:** Assíncrono, não bloqueia event loop

### Audit Logs

Implementado via **interceptor** no Tasks Service:

**Ações rastreadas:**

- `CREATE` — Nova tarefa criada
- `UPDATE` — Tarefa atualizada (campos genéricos)
- `STATUS_CHANGE` — Status alterado (ex: "pending" → "in_progress")
- `DELETE` — Tarefa removida

**Dados capturados:**

```typescript
{
  task_id: string,
  user_id: string,
  action: 'CREATE' | 'UPDATE' | 'STATUS_CHANGE' | 'DELETE',
  old_value: object | null,
  new_value: object,
  timestamp: Date
}
```

**Como funciona:**

1. Interceptor captura requisição **antes** e **depois** da execução
2. Para `UPDATE`, busca valor antigo via `findById`
3. Compara `old_value` com `new_value`
4. Se `status` mudou, marca como `STATUS_CHANGE`
5. Salva registro assíncrono (não bloqueia response)

---

## 🔧 Troubleshooting

### Erro: `ERR_INVALID_THIS` durante build

**Causa:** Incompatibilidade entre `pnpm@8.0.0` e Node.js 18.19.0

**Solução:**

```bash
# Atualizar package.json raiz
"packageManager": "pnpm@9.15.0"

# Limpar e reinstalar
pnpm store prune
pnpm install

# Rebuild Docker
docker-compose down -v
docker-compose build --no-cache
```

### Erro: `database "auth_db" does not exist`

**Causa:** Script SQL não executado na inicialização do PostgreSQL

**Solução:**

```bash
# Criar db-init/01-create-dbs.sql
CREATE DATABASE auth_db;
CREATE DATABASE tasks_db;
CREATE DATABASE notification_db;

# Recriar volume do banco
docker-compose down -v
docker-compose up --build
```

### Frontend não acessível (Invalid Host)

**Causa:** Vite não está escutando em `0.0.0.0`

**Solução:**

```typescript
// apps/web/vite.config.ts
export default defineConfig({
  server: {
    host: "0.0.0.0",
    port: 3000,
    watch: { usePolling: true },
  },
});
```

### WebSocket não conecta

**Verificações:**

1. Access token válido no localStorage
2. Backend rodando na porta 3004
3. CORS configurado corretamente
4. Verificar logs do notifications-service

```bash
docker logs notifications-service -f
```

---

## 🕒 Registro de horas — 13 dias

Relatório detalhado do tempo gasto no projeto JUNGLE-CHALLENGE durante o período de 20/10/2025 a 03/11/2025.

### Resumo Geral

- **Período:** 21/10/2025 - 02/11/2025
- **Total de horas:** 37:11:29 (37.2 horas)
- **Desenvolvedor:** Renan Geraldini Leão

---

### Detalhamento por Dia

| Dia |    Data     | Descrição (resumo)                                          | Tempo gasto (h) |
| --: | :---------: | :---------------------------------------------------------- | :-------------: |
|   1 | 21/10/2025  | Monorepo & Docker básico                                    |       0.9       |
|   2 |  21-22/10   | API Gateway — Estrutura Base                                |       4.3       |
|   3 | 23/10/2025  | API Gateway — JWT & Guards                                  |       2.8       |
|   4 | 22/10/2025  | Auth Service — Setup Completo                               |       1.5       |
|   5 | 23/10/2025  | Auth Service — Endpoints JWT                                |       0.1       |
|   6 | 24/10/2025  | Tasks Service — Estrutura & Entidades                       |       2.5       |
|   7 |  24-26/10   | Tasks Service — CRUD de Tarefas                             |       3.0       |
|   8 |  25-26/10   | Tasks Service — Comentários & RabbitMQ                      |       1.9       |
|   9 |  26-28/10   | Notifications Service — Completo (RabbitMQ + WebSocket)     |       4.2       |
|  10 |  28-29/10   | Front-end — Auth & Layout Base                              |       5.3       |
|  11 |  30-01/11   | Front-end — Dashboard de Tarefas                            |       4.0       |
|  12 | 02/11/2025  | Front-end — Detalhes, Comentários & WebSocket               |       2.9       |
|  13 | 30/10-01/11 | Testes Finais, Ajustes & Documentação                       |       1.3       |
|     |             | **Refatorações e Organização** (25-26/10)                   |       3.3       |
|     |             | **Estudos** (TanStack Query/Router, Context API, WebSocket) |       1.3       |

---

### Distribuição de Tempo

#### Backend Development (20.5h — 55.1%)

- **API Gateway:** 7.1h (19.1%)
- **Auth Service:** 1.6h (4.3%)
- **Tasks Service:** 7.4h (19.9%)
- **Notifications Service:** 4.2h (11.3%)

#### Frontend Development (12.2h — 32.8%)

- **Auth & Layout:** 5.3h (14.2%)
- **Dashboard:** 4.0h (10.8%)
- **Detalhes & WebSocket:** 2.9h (7.8%)

#### Outras Atividades (4.5h — 12.1%)

- **Refatorações e Organização:** 3.3h (8.9%)
- **Estudos:** 1.3h (3.5%)
- **Testes & Documentação:** 1.3h (3.5%)

---

### Observações

1. Alguns dias tiveram trabalho dividido em múltiplas sessões (incluindo madrugada)
2. O tempo de estudos incluiu:
   - TanStack Query (React Query v5)
   - TanStack Router (Type-safe routing)
   - Context API (State management)
   - WebSocket e integração front/back
   - shadcn/ui components
3. Refatorações foram realizadas principalmente nos dias 25-26/10
4. O desenvolvimento seguiu uma abordagem incremental: **backend → integração → frontend**
5. Total de horas corresponde ao relatório Clockify: **37:11:29**

---

## 📚 Aprendizados e Destaques Técnicos

### Configuração de Monorepo

**Desafio inicial:** Turborepo + pnpm workspaces com TypeScript

**Solução implementada:**

- Herança de `tsconfig.base.json` via `extends`
- Shared packages com exports corretos
- Dependências centralizadas no root
- Turborepo pipeline otimizado

```json
// packages/shared-config/tsconfig.base.json
{
  "compilerOptions": {
    "target": "ES2021",
    "experimentalDecorators": true,
    "emitDecoratorMetadata": true
  }
}

// apps/api-gateway/tsconfig.json
{
  "extends": "@my-monorepo/shared-config/tsconfig.base.json"
}
```

### Migração npm → pnpm

**Motivação:**

- **3x mais rápido** que npm
- **Cache global** compartilhado entre projetos
- **Workspaces nativos** (melhor para monorepos)
- **Strict mode** evita phantom dependencies

**Impacto:**

- Redução de 60% no tempo de `install`
- Economia de 40% em espaço em disco

### WebSocket com Autenticação JWT

**Fluxo implementado:**

1. **Login** → `setTokens()` salva access token
2. **AuthContext** detecta token e conecta WebSocket automaticamente
3. **WebSocket** faz handshake com JWT no `auth` object
4. **Backend** valida JWT e registra cliente em `user:{userId}` room
5. **useNotifications** hook escuta eventos e exibe toasts

```typescript
// Frontend: WebSocket connection
const socket = io("http://localhost:3004", {
  auth: { token: accessToken },
  transports: ["websocket"],
});

// Backend: JWT validation no handshake
server.use((socket, next) => {
  const token = socket.handshake.auth.token;
  const decoded = jwt.verify(token, secret);
  socket.join(`user:${decoded.sub}`);
  next();
});
```

### Interceptor para Audit Logs

**Desafio:** Registrar mudanças sem poluir código de negócio

**Solução:** Interceptor NestJS que captura antes/depois

```typescript
@Injectable()
export class TaskAuditInterceptor implements NestInterceptor {
  async intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const taskId = request.params.id;

    // Busca valor ANTES da execução
    const oldValue = await this.tasksService.findOne(taskId);

    // Executa a rota
    const result = await lastValueFrom(next.handle());

    // Compara valores e salva audit log
    await this.saveAuditLog(oldValue, result);

    return result;
  }
}
```

### RabbitMQ Event-Driven

**Pattern:** Fire-and-forget com `emit()`

**Vantagem:** Desacoplamento total entre serviços

```typescript
// Producer (Tasks Service)
this.client.emit('task.created', {
  taskId,
  assignedUsers,
  createdBy
});

// Consumer (Notifications Service)
@EventPattern('task.created')
async handleTaskCreated(data: TaskCreatedEvent) {
  await this.createNotifications(data);
  this.gateway.notifyUsers(data.assignedUsers);
}
```

**Não há `await`** — operação assíncrona não bloqueia

---

## 📦 Dependências Principais

### Backend (NestJS)

```json
{
  "@nestjs/common": "11.1.7",
  "@nestjs/core": "11.1.7",
  "@nestjs/microservices": "11.1.7",
  "@nestjs/platform-socket.io": "11.1.7",
  "@nestjs/swagger": "11.2.1",
  "@nestjs/typeorm": "11.0.0",
  "@nestjs/jwt": "11.0.1",
  "typeorm": "0.3.27",
  "pg": "8.13.1",
  "amqplib": "0.10.4",
  "socket.io": "4.7.1",
  "pino": "^9.0.0",
  "class-validator": "0.14.2",
  "bcrypt": "^5.1.1"
}
```

### Frontend (React)

```json
{
  "react": "^18.3.1",
  "vite": "^5.4.1",
  "@tanstack/react-query": "^5.56.2",
  "@tanstack/react-router": "^1.58.3",
  "react-hook-form": "^7.53.0",
  "zod": "^3.23.8",
  "socket.io-client": "^4.7.5",
  "tailwindcss": "^3.4.1",
  "react-hot-toast": "^2.4.1"
}
```

---

## 📋 Checklist do que foi entregue

- ✅ Repositório com monorepo funcional (apps + packages)
- ✅ Docker Compose que sobe todos os serviços (db + rabbitmq)
- ✅ Auth (register/login/refresh) + guards JWT
- ✅ CRUD de tasks + comments
- ✅ Notificações via RabbitMQ + WebSocket
- ✅ README com instruções claras e diagramas
- ✅ Swagger/OpenAPI documentation
- ✅ Rate limiting e segurança (Helmet, CORS)

---

## 👨‍💻 Autor / Contato

- GitHub: [@renanjava](https://github.com/renanjava)
- LinkedIn: [Renan Geraldini Leão](https://www.linkedin.com/in/renan-g-l/)
- Email: renanleao.f90@hotmail.com
