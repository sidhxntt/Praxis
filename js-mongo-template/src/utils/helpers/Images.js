import { BaseData } from "./BaseData.js";

export class ImageData extends BaseData {
  constructor(model) {
    super(model, "Image");
  }

  async create(req, res) {
    const { albumId, title, url, thumbnailUrl } = req.body;

    const image = await this.model.create({
      data: { albumId, title, url, thumbnailUrl },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Image created successfully", image);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, url, thumbnailUrl } = req.body;

    const image = await this.model.update({
      where: { id },
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

    await this.model.delete({ where: { id } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Image deleted successfully");
  }
}
