import { BaseData } from "./BaseData.js";
import { PrismaClient } from "@prisma/client";

export class AlbumData extends BaseData {
  constructor(model) {
    super(model, "Album");
    this.prisma = new PrismaClient();
  }
  async create(req, res) {
    const { userID, title } = req.body;

    const album = await this.model.create({
      data: { userID, title },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Album created successfully", album);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;
    const albumID = this.parseIdToNumber(id);

    const album = await this.model.update({
      where: { id: albumID },
      data: { title },
    });

    await Promise.all([
      this.updateRecordCache(id, album),
      this.clearModelCache(),
    ]);

    return this.sendResponse(res, 200, "Album updated successfully", album);
  }

  async delete(req, res) {
    const { id } = req.params;
    const albumID = this.parseIdToNumber(id);

    await this.prisma.$transaction(async (tx) => {
      await tx.image.deleteMany({ where: { albumID: albumID } });
      await tx.album.delete({ where: { id: albumID } });
    });

    await this.clearModelCache();
    return this.sendResponse(res, 200, "Album and images deleted successfully");
  }
}
