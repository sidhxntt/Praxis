import { Request, Response } from "express";
import { BaseData } from "./BaseData";
import { PrismaClient } from "@prisma/client";

export class AlbumData extends BaseData {
    private readonly prisma: PrismaClient;
  
  constructor(model: any) {
    super(model, "Album");
    this.prisma = new PrismaClient();

  }

  public async create(req: Request, res: Response) {
    const { userID, title } = req.body;

    const album = await this.model.create({
      data: { userID, title },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Album created successfully", album);
  }

  public async update(req: Request, res: Response) {
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

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    await this.prisma.$transaction(async (prisma: any) => {
      await prisma.image.deleteMany({ where: { albumID: id } });
      await prisma.album.delete({ where: { id } });
    });

    await this.clearModelCache();
    return this.sendResponse(res, 200, "Album and images deleted successfully");
  }
}
