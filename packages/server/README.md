# server

Express 5 + Mongoose 9 + Zod. Todos in Mongo, JSON over `/api/todos`. OpenAPI UI is mounted in-process.

## Run

```bash
# from repo root
cp packages/server/.env.example packages/server/.env   # once
npm run db:up
npm run dev:server
```

From this package: `npm run dev` (`tsx watch src/index.ts`).

|         |                                |
| ------- | ------------------------------ |
| API     | http://localhost:3001          |
| Health  | http://localhost:3001/health   |
| Swagger | http://localhost:3001/api/docs |

`GET /health` returns `{ ok: true, db: "connected" | "disconnected" }`.

## Env

`.env` (gitignored). Copy from `.env.example`:

```
PORT=3001
MONGODB_URI=mongodb://127.0.0.1:27017/todo
```

Compose runs `mongo:7` as `hiring-fullstack-todo-mongo`, port 27017, volume `mongo_data`. If 27017 is already taken, stop the other Mongo (or that compose) first.

```bash
npm run db:seed    # delete all, insert Todo 1 … Todo 50 (newest-first list)
```

## Routes

Mounted at `/api/todos`. Body validated with Zod; `:id` must be a Mongo ObjectId.

| Method   | Path                      |                                                            |
| -------- | ------------------------- | ---------------------------------------------------------- |
| `GET`    | `/api/todos?skip=&limit=` | Newest first. Default `skip=0`, `limit=8`, max `limit=50`. |
| `POST`   | `/api/todos`              | `{ title, description? }` → 201                            |
| `PUT`    | `/api/todos/:id`          | Replace title/description                                  |
| `PATCH`  | `/api/todos/:id/done`     | Toggle `done`                                              |
| `DELETE` | `/api/todos/:id`          | 204                                                        |

List payload:

```json
{
  "items": [
    {
      "id": "...",
      "title": "...",
      "description": null,
      "done": false,
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "total": 50,
  "skip": 0,
  "limit": 8,
  "hasMore": true
}
```

Response `id` is `_id` as a string. `createdAt` / `updatedAt` are ISO strings (Mongo still stores `Date`). Index is `{ createdAt: -1 }` only.

Types for that JSON live in `shared` (`Todo`, `TodoListPage`, `TodoWrite`). The Mongoose document is local (`TodoDocument` with `Date`).

## Layout

```text
src/
├── index.ts              # cors, json, swagger, /health, /api/todos
├── db.ts
├── swagger.ts            # OpenAPI document for swagger-ui-express
├── routes/todo.routes.ts
├── controllers/todo.controller.ts
├── models/todo.ts
├── middleware/validate.ts
├── validators/todo.validators.ts
└── scripts/seed.ts
```

## Scripts

| Script          |                                                 |
| --------------- | ----------------------------------------------- |
| `npm run dev`   | Watch + restart                                 |
| `npm run build` | `tsc` → `dist/`                                 |
| `npm start`     | `node dist/index.js` (needs a build)            |
| `npm run seed`  | Seed 50 rows (also `npm run db:seed` from root) |

Swagger is the same spec as the routes above (`skip`/`limit` on GET, `TodoListPage` schema). Use Try it out against the running server.
