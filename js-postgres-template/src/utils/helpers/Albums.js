import { BaseData } from "./BaseData.js";
import { PrismaClient } from "@prisma/client";

export class AlbumData extends BaseData {
  constructor(model) {
    super(model, "Album");
    this.prisma = new PrismaClient();
  }

  async create(req, res) {
    const { userId, title } = req.body;

    if (!userId || !title) {
      return this.sendResponse(
        res,
        400,
        "userId and title are required",
        undefined,
        "Missing required fields"
      );
    }

    const album = await this.model.create({
      data: {
        userId: parseInt(userId, 10),
        title,
      },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Album created successfully", album);
  }

  async update(req, res) {
    const { id } = req.params;
    const { title } = req.body;
    const albumId = this.parseIdToNumber(id);

    if (!title) {
      return this.sendResponse(
        res,
        400,
        "Title is required",
        undefined,
        "Missing required field"
      );
    }

    const album = await this.model.update({
      where: { id: albumId },
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
    const albumId = this.parseIdToNumber(id);

    await this.prisma.$transaction(async (tx) => {
      // First delete all images in the album
      await tx.image.deleteMany({
        where: { albumId },
      });

      // Then delete the album
      await tx.album.delete({
        where: { id: albumId },
      });
    });

    await this.clearModelCache();
    return this.sendResponse(
      res,
      200,
      "Album and related images deleted successfully"
    );
  }
}
