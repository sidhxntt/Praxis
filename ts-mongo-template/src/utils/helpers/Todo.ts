import { BaseData } from "./BaseData";
import { Request, Response } from "express";

export class TodoData extends BaseData {

  constructor(model: any) {
    super(model, "Todos");
  }

  public async create(req: Request, res: Response) {
    const { userID, title, completed } = req.body;

    const todo = await this.model.create({
      data: { userID, title, completed },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Todo created successfully", todo);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, completed } = req.body;

    const todo = await this.model.update({
      where: { id },
      data: { title, completed },
    });

    await Promise.all([
      this.updateRecordCache(id, todo),
      this.clearModelCache(),
    ]);

    return this.sendResponse(res, 200, "Todo updated successfully", todo);
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    await this.model.delete({ where: { id } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Todo deleted successfully");
  }
}
