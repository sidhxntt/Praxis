import { BaseData } from "./BaseData.js";

export class TodoData extends BaseData {
  constructor(model) {
    super(model, "Todos");
  }

  async create(req, res) {
    const { userID, title, completed } = req.body;

    const todo = await this.model.create({
      data: { userID, title, completed },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Todo created successfully", todo);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, completed } = req.body;
    const todoID = this.parseIdToNumber(id);

    const todo = await this.model.update({
      where: { id: todoID },
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
    const todoID = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: todoID } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Todo deleted successfully");
  }
}
