import { Request, Response } from "express";
import { redis_connection } from "../Clients/Redis";

const redis = redis_connection();

// Base class with common functionality
export class BaseData {
  protected readonly model: any;
  protected readonly modelName: string;

  constructor(model: any, modelName: string) {
    this.model = model;
    this.modelName = modelName;
  }
  protected generateCacheKey = (page?: number, limit?: number, id?: string) =>
    id ? `${this.modelName}:${id}` : `${this.modelName}:${page}:${limit}`;

  protected async clearModelCache() {
    const keys = await redis.keys(`${this.modelName}:*`);
    if (keys.length) await redis.del(keys);
  }

  protected async updateRecordCache(id: string, data: any) {
    await redis.setex(
      this.generateCacheKey(undefined, undefined, id),
      3600,
      JSON.stringify(data)
    );
  }

  protected sendResponse<T>(
    res: Response,
    statusCode: number,
    message: string,
    data?: T,
    error?: string
  ) {
    return res.status(statusCode).json({
      status: statusCode >= 400 ? "error" : "success",
      message,
      ...(data && { data }),
      ...(error && { error }),
    });
  }

  protected generatePagination(req: Request) {
    const page = parseInt((req.query.page as string) || "1", 10);
    const limit = parseInt((req.query.limit as string) || "10", 10);
    return { page, limit, offset: (page - 1) * limit };
  }

  // Common GET methods
  public async getAll(req: Request, res: Response) {
    const { page, limit, offset } = this.generatePagination(req);
    const cacheKey = this.generateCacheKey(page, limit);

    const cachedData = await redis.get(cacheKey);
    if (cachedData)
      return this.sendResponse(
        res,
        200,
        "Data fetched from cache",
        JSON.parse(cachedData)
      );

    const [items, total] = await Promise.all([
      this.model.findMany({ skip: offset, take: limit }),
      this.model.count(),
    ]);

    const responseData = {
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
      data: items,
    };

    await redis.setex(cacheKey, 3600, JSON.stringify(responseData));
    return this.sendResponse(
      res,
      200,
      "Data fetched successfully",
      responseData
    );
  }

  public async getOne(req: Request, res: Response) {
    const { id } = req.params;

    const cacheKey = this.generateCacheKey(undefined, undefined, id);
    const cachedData = await redis.get(cacheKey);
    if (cachedData)
      return this.sendResponse(
        res,
        200,
        "Data fetched from cache",
        JSON.parse(cachedData)
      );

    const item = await this.model.findUnique({ where: { id } });
    if (!item)
      return this.sendResponse(
        res,
        404,
        "Item not found",
        undefined,
        "Not found"
      );

    await this.updateRecordCache(id, item);
    return this.sendResponse(res, 200, "Data fetched successfully", item);
  }
}
