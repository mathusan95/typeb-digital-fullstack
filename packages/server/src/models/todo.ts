import mongoose from "mongoose";

export type Todo = {
  title: string;
  description: string | null;
  done: boolean;
  createdAt: Date;
  updatedAt: Date;
};

const todoSchema = new mongoose.Schema<Todo>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: null },
    done: { type: Boolean, default: false },
  },
  { timestamps: true },
);

todoSchema.index({ createdAt: -1 });

export const TodoModel = mongoose.model("Todo", todoSchema);
