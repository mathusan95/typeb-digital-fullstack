# client

Vite 8 + React 19 + TypeScript. The UI is a single notepad-style list: infinite scroll, add/edit/delete modals, toasts, and a sticky Add button.

## Run

From the repo root (API should already be up on 3001):

```bash
npm run dev:client
```

Or from this package: `npm run dev`. App: http://localhost:5173

| Script            |                                  |
| ----------------- | -------------------------------- |
| `npm run dev`     | Vite, port 5173                  |
| `npm run build`   | `tsc --noEmit` then `vite build` |
| `npm run preview` | Preview the production build     |

## Talking to the API

There is no `VITE_` base URL. `todoApi.ts` calls `/api/...` and Vite proxies that to `http://localhost:3001`:

```ts
// vite.config.ts
proxy: { "/api": { target: "http://localhost:3001", changeOrigin: true } }
```

If the list is empty or you see a network banner, the proxy cannot reach the server (server not running, or Mongo down).

## Layout

```text
src/
├── App.tsx                 # ToastProvider + ListTodo
├── index.css               # notepad styles
├── components/             # Button, Modal, Loading, Toast
├── features/todo/
│   ├── ListTodo.tsx        # list + infinite scroll + modals
│   ├── todoApi.ts          # fetch wrappers
│   └── *Modal.tsx
└── store/useTodoStore.ts   # Zustand: todos, pagination, load/error
```

Shared DTO types come from the `shared` workspace package (`Todo`, `TodoListPage`, `TodoWrite`). Dates on the client are ISO strings.

### State

List data lives in Zustand (`todos`, `hasMore`, `isLoading`, `errorMessage`). Modal open flags and the in-flight done/undone id stay in `useState` on `ListTodo` — they are view-only.

First page is `GET /api/todos?skip=0&limit=8`. Scroll loads the next page with `skip = todos.length`. Create prepends; update/toggle replace by `id`; delete removes from the store.

`react-infinite-scroll-component` uses `#todo-scroll` as `scrollableTarget` so paging is tied to the list pane, not the window.

### UI bits

Reusable `Button` (`loading` shows the shared `Loading` mark), `Modal`, `Toast`. Done/undone, edit, and delete sit on each row. Delete and edit go through confirm/edit modals; submit stays open until the request finishes.
