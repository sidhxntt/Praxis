import { BaseData } from "./BaseData";
import { Request, Response } from "express";

export class PostData extends BaseData {
  constructor(model: any) {
    super(model, "Post");
  }

  public async create(req: Request, res: Response) {
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
      data: { userId, title, body },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Post created successfully", post);
  }

  public async update(req: Request, res: Response) {
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

  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const postId = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: postId } });
    await this.clearModelCache();
  }
}
