import { BaseData } from "./BaseData.js";
export class TodoData extends BaseData {
  constructor(model) {
    super(model, "Todos");
  }

  async create(req, res) {
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

  async update(req, res) {
    const { id } = req.params;
    const { title, completed } = req.body;

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
      where: { id },
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

  async delete(req, res) {
    const { id } = req.params;

    await this.model.delete({ where: { id } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Todo deleted successfully");
  }
}
