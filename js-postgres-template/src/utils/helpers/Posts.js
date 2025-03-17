import { BaseData } from "./BaseData.js";

export class PostData extends BaseData {
  constructor(model) {
    super(model, "Post");
  }

  async create(req, res) {
    const { userId, title, body } = req.body;

    if (!userId || !title || !body) {
      return this.sendResponse(
        res,
        400,
        "userId, title, and body are required",
        undefined,
        "Missing required fields"
      );
    }

    const post = await this.model.create({
      data: {
        userId: parseInt(userId, 10),
        title,
        body,
      },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Post created successfully", post);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, body } = req.body;
    const postId = this.parseIdToNumber(id);

    if (!title && !body) {
      return this.sendResponse(
        res,
        400,
        "At least one field (title or body) must be provided",
        undefined,
        "Missing update fields"
      );
    }

    const post = await this.model.update({
      where: { id: postId },
      data: {
        ...(title && { title }),
        ...(body && { body }),
      },
    });

    await Promise.all([
      this.updateRecordCache(id, post),
      this.clearModelCache(),
    ]);

    return this.sendResponse(res, 200, "Post updated successfully", post);
  }

  async delete(req, res) {
    const { id } = req.params;
    const postId = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: postId } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Post deleted successfully");
  }
}
