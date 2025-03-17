import { BaseData } from "./BaseData.js";

export class TodoData extends BaseData {
  constructor(model) {
    super(model, "Todos");
  }

  async create(req, res) {
    const { userId, title, completed = false } = req.body;

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
      data: {
        userId: parseInt(userId, 10),
        title,
        completed: Boolean(completed),
      },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Todo created successfully", todo);
  }

  async update(req, res) {
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

  async delete(req, res) {
    const { id } = req.params;
    const todoId = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: todoId } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Todo deleted successfully");
  }
}
