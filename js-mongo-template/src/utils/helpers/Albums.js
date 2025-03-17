import { BaseData } from "./BaseData.js";
import { PrismaClient } from "@prisma/client";

export class AlbumData extends BaseData {
  constructor(model) {
    super(model, "Album");
    this.prisma = new PrismaClient();
  }

  async create(req, res) {
    const { userId, title } = req.body;

    const album = await this.model.create({
      data: { userId, title },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Album created successfully", album);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;

    const album = await this.model.update({
      where: { id },
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

    await this.prisma.$transaction(async (prisma) => {
      await prisma.image.deleteMany({ where: { albumId: id } });
      await prisma.album.delete({ where: { id } });
    });

    await this.clearModelCache();
    return this.sendResponse(res, 200, "Album and images deleted successfully");
  }
}
