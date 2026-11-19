# hiring-fullstack-todo

Todo app as an npm workspaces + Lerna monorepo.

| Package  | Path                                 | Role                                                   |
| -------- | ------------------------------------ | ------------------------------------------------------ |
| `client` | [`packages/client`](packages/client) | Vite + React UI                                        |
| `server` | [`packages/server`](packages/server) | Express + Mongo API                                    |
| `shared` | [`packages/shared`](packages/shared) | Types used on the wire (`Todo`, list page, write body) |

Node 20+ (see `.nvmrc`). Details for each app live in that package’s README.

## Setup

```bash
npm install
cp packages/server/.env.example packages/server/.env
npm run db:up
npm run db:seed
npm run dev
```

| App     | URL                            |
| ------- | ------------------------------ |
| UI      | http://localhost:5173          |
| API     | http://localhost:3001          |
| Health  | http://localhost:3001/health   |
| Swagger | http://localhost:3001/api/docs |

Mongo is Docker (`mongo:7` on `27017`, db `todo`). Stop whatever else is bound to 27017 first if compose fails.

`shared` is types only. No extra build step after clone; `import type` is erased, Vite/`tsx` read `packages/shared/src`.

## Scripts (root)

| Command                                 | What it does                                 |
| --------------------------------------- | -------------------------------------------- |
| `npm run dev`                           | Client + server                              |
| `npm run dev:client`                    | Vite on 5173                                 |
| `npm run dev:server`                    | API on 3001                                  |
| `npm run db:up` / `db:down` / `db:logs` | Mongo container                              |
| `npm run db:seed`                       | Wipe todos, insert Todo 1–50                 |
| `npm run lint` / `format`               | ESLint / Prettier                            |
| `npm run build`                         | `lerna run build` (shared is `tsc --noEmit`) |

Husky + lint-staged: ESLint and Prettier on staged files.

See [packages/client/README.md](packages/client/README.md) and [packages/server/README.md](packages/server/README.md).
