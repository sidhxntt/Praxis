import { BaseData } from "./BaseData.js";

export class ImageData extends BaseData {
  constructor(model) {
    super(model, "Image");
  }

  async create(req, res) {
    const { albumID, title, url, thumbnailUrl } = req.body;

    const image = await this.model.create({
      data: { albumID, title, url, thumbnailUrl },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Image created successfully", image);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title, url, thumbnailUrl } = req.body;
    const imageID = this.parseIdToNumber(id);

    const image = await this.model.update({
      where: { id: imageID },
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
    const imageID = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: imageID } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Image deleted successfully");
  }
}
