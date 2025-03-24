import { BaseData } from "./BaseData.js";

export class TaskData extends BaseData {
  constructor(model) {
    super(model, "Todos");
  }

  async create(req, res) {
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
  async update(req, res) {
    const { id } = req.params;
    const { title, status, label, priority } = req.body;

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
      where: { id },
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
  async delete(req, res) {
    const { id } = req.params;

    await this.model.delete({ where: { id } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Todo deleted successfully");
  }
}
