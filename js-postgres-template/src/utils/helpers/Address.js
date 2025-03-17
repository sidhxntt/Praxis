import { BaseData } from "./BaseData.js";

export class AddressData extends BaseData {
  constructor(model) {
    super(model, "Address");
  }

  async create(req, res) {
    const { userId, street, suite, city, zipcode } = req.body;

    if (!userId || !street || !city || !zipcode) {
      return this.sendResponse(
        res,
        400,
        "userId, street, city, and zipcode are required",
        undefined,
        "Missing required fields"
      );
    }

    const address = await this.model.create({
      data: {
        userId: parseInt(userId, 10),
        street,
        suite,
        city,
        zipcode,
      },
    });

    await this.clearModelCache();
    return this.sendResponse(res, 201, "Address created successfully", address);
  }

  async update(req, res) {
    const { id } = req.params;
    const { street, suite, city, zipcode } = req.body;
    const addressId = this.parseIdToNumber(id);

    if (!street && !suite && !city && !zipcode) {
      return this.sendResponse(
        res,
        400,
        "At least one field (street, suite, city, or zipcode) must be provided",
        undefined,
        "Missing update fields"
      );
    }

    const address = await this.model.update({
      where: { id: addressId },
      data: {
        ...(street && { street }),
        ...(suite && { suite }),
        ...(city && { city }),
        ...(zipcode && { zipcode }),
      },
    });

    await Promise.all([
      this.updateRecordCache(id, address),
      this.clearModelCache(),
    ]);

    return this.sendResponse(res, 200, "Address updated successfully", address);
  }

  async delete(req, res) {
    const { id } = req.params;
    const addressId = this.parseIdToNumber(id);

    await this.model.delete({ where: { id: addressId } });
    await this.clearModelCache();
    return this.sendResponse(res, 200, "Address deleted successfully");
  }
}
