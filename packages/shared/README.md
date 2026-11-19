# shared

Wire types for client and server. No runtime code.

```ts
import type { Todo, TodoListPage, TodoWrite } from "shared";
```

`package.json` exports `./src/index.ts`. After `npm install` at the repo root, both workspaces resolve `shared`. Nothing to compile; `import type` is erased.

Do not put the Mongoose document shape here (`Date`, no `id`). That stays in `packages/server/src/models/todo.ts`.
