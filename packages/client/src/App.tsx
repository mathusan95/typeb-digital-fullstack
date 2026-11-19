import { ToastProvider } from "./components/Toast";
import { ListTodo } from "./features/todo/ListTodo";

export default function App() {
  return (
    <ToastProvider>
      <main>
        <ListTodo />
      </main>
    </ToastProvider>
  );
}
