import { BaseData } from "./BaseData";
import { Request, Response } from "express";

export class PostData extends BaseData {
  constructor(model: any) {
    super(model, "Post");
  }

  public async create(req: Request, res: Response) {
    const { userID, title, body } = req.body;

    const post = await this.model.create({
      data: { userID, title, body },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Post created successfully", post);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, body } = req.body;
    const postID = this.parseIdToNumber(id)

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

  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const postID = this.parseIdToNumber(id)

    await this.model.delete({ where: { id: postID } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Post deleted successfully");

  }
}
