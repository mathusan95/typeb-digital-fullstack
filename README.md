# hiring-fullstack-todo

Lerna + npm workspaces monorepo for a fullstack todo app.

## Structure

```text
hiring-fullstack-todo/
├── packages/
│   ├── client/          # Frontend (Vite + React + TypeScript)
│   │   └── src/
│   └── server/          # Backend (Express + TypeScript)
│       └── src/
├── docker-compose.yml   # Local MongoDB (Docker)
├── lerna.json           # Lerna config (uses npm workspaces)
├── eslint.config.js     # Shared ESLint (flat config)
├── .prettierrc          # Shared Prettier
├── .husky/              # Git hooks (pre-commit → lint-staged)
└── package.json         # Root scripts and shared tooling
```

## Scripts

| Command              | What it does                        |
| -------------------- | ----------------------------------- |
| `npm run dev`        | Start client and server together    |
| `npm run dev:client` | Start Vite on http://localhost:5173 |
| `npm run dev:server` | Start API on http://localhost:3001  |
| `npm run lint`       | ESLint across the repo              |
| `npm run format`     | Prettier write                      |
| `npm run build`      | Build both packages via Lerna       |
| `npm run db:up`      | Start MongoDB in Docker             |
| `npm run db:down`    | Stop MongoDB                        |
| `npm run db:logs`    | Tail MongoDB container logs         |

## Database

MongoDB runs in Docker, not inside the Node process. Start it, then start the API:

```bash
npm run db:up
cp packages/server/.env.example packages/server/.env
npm run dev:server
```

The server connects to `mongodb://127.0.0.1:27017/todo`. `/health` reports `db: "connected"` when the container is up.

Husky runs `lint-staged` on commit: ESLint + Prettier on staged files.

# typeb-digital-fullstack
