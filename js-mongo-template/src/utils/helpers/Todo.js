import { BaseData } from "./BaseData.js";

export class TodoData extends BaseData {
  constructor(model) {
    super(model, "Todos");
  }

  async create(req, res) {
    const { userId, title, completed } = req.body;

    const todo = await this.model.create({
      data: { userId, title, completed },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Todo created successfully", todo);
  }

  async update(req, res) {
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

  async delete(req, res) {
    const { id } = req.params;

    await this.model.delete({ where: { id } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Todo deleted successfully");
  }
}
