import { Router } from "express";
import { listTodos } from "../controllers/todo.controller.js";

const router = Router();

router.get("/", listTodos);

export default router;
