import type { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";
import type { ZodType } from "zod";

export function validateBody(schema: ZodType) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body);
    if (!result.success) {
      res.status(400).json({ error: result.error.flatten() });
      return;
    }

    req.body = result.data;
    next();
  };
}

export function validateId(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const id = req.params.id;
  if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ error: "Invalid todo id" });
    return;
  }

  next();
}
