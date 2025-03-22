import { BaseData } from "./BaseData";
import { Request, Response } from "express";

export class ImageData extends BaseData {
  constructor(model: any) {
    super(model, "Image");
  }

  public async create(req: Request, res: Response) {
    const { albumId, title, url, thumbnailUrl } = req.body;

    if (!albumId) {
      return this.sendResponse(
        res,
        400,
        "Album Id is required",
        undefined,
        "Missing required field"
      );
    }

    const image = await this.model.create({
      data: { albumId, title, url, thumbnailUrl },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Image created successfully", image);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { title, url, thumbnailUrl } = req.body;
    const imageId = this.parseIdToNumber(id);

    const image = await this.model.update({
      where: { id: imageId },
      data: { title, url, thumbnailUrl },
    });

    await Promise.all([
      this.updateRecordCache(id, image),
      this.clearModelCache(),
    ]);

    return this.sendResponse(res, 200, "Image updated successfully", image);
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;
    const imageId = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: imageId} });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Image deleted successfully");
  }
}
