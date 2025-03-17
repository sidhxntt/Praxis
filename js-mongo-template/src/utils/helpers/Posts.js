import { BaseData } from "./BaseData.js";

export class PostData extends BaseData {
  constructor(model) {
    super(model, "Post");
  }

  async create(req, res) {
    const { userId, title, body } = req.body;

    const post = await this.model.create({
      data: { userId, title, body },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Post created successfully", post);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, body } = req.body;

    const post = await this.model.update({
      where: { id },
      data: { title, body },
    });

    await Promise.all([
      this.updateRecordCache(id, post),
      this.clearModelCache(),
    ]);

    return this.sendResponse(res, 200, "Post updated successfully", post);
  }

  async delete(req, res) {
    const { id } = req.params;

    await this.model.delete({ where: { id } });
    await this.clearModelCache();
  }
}
