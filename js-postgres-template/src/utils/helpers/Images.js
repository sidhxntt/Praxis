import { BaseData } from "./BaseData.js";

export class ImageData extends BaseData {
  constructor(model) {
    super(model, "Image");
  }

  async create(req, res) {
    const { albumId, title, url, thumbnailUrl } = req.body;

    if (!albumId) {
      return this.sendResponse(
        res,
        400,
        "Album ID is required",
        undefined,
        "Missing required field"
      );
    }

    const image = await this.model.create({
      data: {
        albumId: parseInt(albumId, 10),
        title,
        url,
        thumbnailUrl,
      },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Image created successfully", image);
  }

  async update(req, res) {
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

  async delete(req, res) {
    const { id } = req.params;
    const imageId = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: imageId } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Image deleted successfully");
  }
}
