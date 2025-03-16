import { BaseData } from "./BaseData";
import { Request, Response } from "express";

export class TodoData extends BaseData {
  constructor(model: any) {
    super(model, "Todos");
  }

  public async create(req: Request, res: Response) {
    const { userId, title, completed } = req.body;
    if (!userId || !title) {
      return this.sendResponse(
        res,
        400,
        "userId and title are required",
        undefined,
        "Missing required fields"
      );
    }

    const todo = await this.model.create({
      data: { userId, title, completed },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Todo created successfully", todo);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todoId = this.parseIdToNumber(id);

    if (!title && completed === undefined) {
      return this.sendResponse(
        res,
        400,
        "At least one field (title or completed) must be provided",
        undefined,
        "Missing update fields"
      );
    }
    const todo = await this.model.update({
      where: { id: todoId },
      data: {
        ...(title && { title }),
        ...(completed !== undefined && { completed: Boolean(completed) }),
      },
    });

    await Promise.all([
      this.updateRecordCache(id, todo),
      this.clearModelCache(),
    ]);

    return this.sendResponse(res, 200, "Todo updated successfully", todo);
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const todoId = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: todoId } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Todo deleted successfully");
  }
}
