import { BaseData } from "./BaseData";
import { Request, Response } from "express";

export class TaskData extends BaseData {
  constructor(model: any) {
    super(model, "Todos");
  }

  public async create(req: Request, res: Response) {
    const { title, status, label, priority } = req.body;
    if (!title && !status && !label && !priority) {
      return this.sendResponse(
        res,
        400,
        "Fields (title, status, label, or priority) must be provided",
        undefined,
        "Missing update fields"
      );
    }

    const todo = await this.model.create({
      data: { title, status, label, priority },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Todo created successfully", todo);
  }
  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, status, label, priority } = req.body;
    const taskId = this.parseIdToNumber(id);
  
    if (!title && !status && !label && !priority) {
      return this.sendResponse(
        res,
        400,
        "At least one field (title, status, label, or priority) must be provided",
        undefined,
        "Missing update fields"
      );
    }
  
    const task = await this.model.update({
      where: { id: taskId },
      data: {
        ...(title && { title }),
        ...(status && { status }),
        ...(label && { label }),
        ...(priority && { priority }),
      },
    });
  
    await Promise.all([
      this.updateRecordCache(id, task),
      this.clearModelCache(),
    ]);
  
    return this.sendResponse(res, 200, "Task updated successfully", task);
  }
  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const todoId = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: todoId } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Todo deleted successfully");
  }
}
