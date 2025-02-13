import { PrismaClient } from "@prisma/client";
import { BaseData } from "./BaseData";
import { Request, Response } from "express";

export class UserData extends BaseData {
  private readonly prisma: PrismaClient;
  
  constructor(model: any) {
    super(model, "User");
    this.prisma = new PrismaClient();
  }

  public async create(req: Request, res: Response) {
    const { name, username, email, address, phone, website } = req.body;

    const existingUser = await this.model.findFirst({
      where: { OR: [{ email }, { username }] },
    });

    if (existingUser) {
      return this.sendResponse(
        res,
        400,
        "User already exists",
        undefined,
        "Duplicate user"
      );
    }

    const user = await this.model.create({
      data: {
        name,
        username,
        email,
        phone,
        website,
        address: address ? { create: address } : undefined,
      },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "User created successfully", user);
  }

  public async update(req: Request, res: Response) {
    const { id } = req.params;
    const { name, username, email, address, phone, website } = req.body;

    const user = await this.model.update({
      where: { id },
      data: {
        name,
        username,
        email,
        phone,
        website,
        address: address
          ? {
              upsert: {
                create: address,
                update: address,
              },
            }
          : undefined,
      },
    });

    await Promise.all([
      this.updateRecordCache(id, user),
      this.clearModelCache(),
    ]);

    return this.sendResponse(res, 200, "User updated successfully", user);
  }

  public async delete(req: Request, res: Response) {
    const { id } = req.params;

    await this.prisma.$transaction(async (prisma: any) => {
      await prisma.image.deleteMany({
        where: { album: { userID: id } },
      });
      await prisma.album.deleteMany({ where: { userID: id } });
      await prisma.post.deleteMany({ where: { userID: id } });
      await prisma.todos.deleteMany({ where: { userID: id } });
      await prisma.address.deleteMany({ where: { userID: id } });
      await prisma.user.delete({ where: { id } });
    });

    await this.clearModelCache();
    return this.sendResponse(
      res,
      200,
      "User and related data deleted successfully"
    );
  }
}
