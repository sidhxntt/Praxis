import { BaseData } from "./BaseData.js";

export class PostData extends BaseData {
  constructor(model) {
    super(model, "Post");
  }

  async create(req, res) {
    const { userID, title, body } = req.body;

    const post = await this.model.create({
      data: { userID, title, body },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Post created successfully", post);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, body } = req.body;
    const postID = this.parseIdToNumber(id);

    const post = await this.model.update({
      where: { id: postID },
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
    const postID = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: postID } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Post deleted successfully");
  }
}
