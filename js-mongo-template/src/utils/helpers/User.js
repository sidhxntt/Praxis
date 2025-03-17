//  Usage: This file contains the class for API User. It contains methods for signup, login, and other user related operations.
// It extends the Data class and uses the PrismaClient instance for database operations.
// The class also contains methods for sending email and SMS notifications using Bull queues.

import bcrypt from "bcrypt";
import JWT from "../../controllers/Authentication.js";
import dotenv from "dotenv";
import { emailQueue, smsQueue } from "../Clients/Queues.js";
import { BaseData } from "./BaseData.js";
import { prisma } from "../Clients/Prisma.js";

dotenv.config();

export default class UserData extends BaseData {
  constructor(model) {
    super(model, "User");
  }

  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  signupPage = (req, res) => {
    console.info("Signup page accessed");
    return this.sendResponse(
      res,
      200,
      "Signup to Login. Provide your email & password to signup in json format in request body."
    );
  };

  signup = async (req, res) => {
    const { email, password, role, name, username, phone, website } = req.body;

    // 1. Initial validation
    if (!email || !password) {
      return this.sendResponse(
        res,
        400,
        "Email and password are required",
        undefined,
        "Missing required fields"
      );
    }

    if (!this.isValidEmail(email)) {
      return this.sendResponse(
        res,
        400,
        "Invalid email format",
        undefined,
        "Invalid email"
      );
    }

    // 2. Build query conditions for unique fields
    const uniqueFieldsToCheck = [
      { email },
      ...(username ? [{ username }] : []),
      ...(phone ? [{ phone }] : []),
      ...(website ? [{ website }] : []),
    ];

    // 3. Single database query to check all unique fields
    const existingUser = await this.model.findFirst({
      where: {
        OR: uniqueFieldsToCheck,
      },
      select: {
        email: true,
        username: true,
        phone: true,
        website: true,
      },
    });

    // 4. Check which unique field caused the conflict
    if (existingUser) {
      const conflictField =
        existingUser.email === email
          ? "Email"
          : existingUser.username === username
          ? "Username"
          : existingUser.phone === phone
          ? "Phone number"
          : "Website";

      return this.sendResponse(
        res,
        400,
        `${conflictField} already exists`,
        undefined,
        `Duplicate ${conflictField.toLowerCase()}`
      );
    }

    // 5. Create user with single database operation
    const newUser = await this.model.create({
      data: {
        email,
        password: await bcrypt.hash(password, 10),
        role: role || "user",
        ...(name && { name }),
        ...(username && { username }),
        ...(phone && { phone }),
        ...(website && { website }),
      },
    });

    // 6. Queue notifications in parallel
    const [emailJob, smsJob] = await Promise.all([
      emailQueue.add("send-email", {
        email: process.env.SMTP_FROM,
        message: "New User added to API",
      }),
      smsQueue.add("send-sms", {
        to: process.env.PHONE_NUMBER,
        message: "New User added to API",
      }),
    ]);

    console.info(
      `User created - Email Job ID: ${emailJob.id}, SMS Job ID: ${smsJob.id}`
    );

    return this.sendResponse(res, 201, "User created successfully", {
      id: newUser.id,
      email: newUser.email,
      message: "User created successfully",
      instruction: "Login to continue",
    });
  };

  loginPage = (req, res) => {
    console.info("Login Page Accessed");
    return this.sendResponse(
      res,
      200,
      "Login to Continue. Provide your email & password to login in json format in request body."
    );
  };

  login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return this.sendResponse(
        res,
        400,
        "Authentication failed",
        undefined,
        "Email and password are required"
      );
    }

    const existingUser = await this.model.findUnique({
      where: { email },
    });

    if (!existingUser) {
      return this.sendResponse(
        res,
        400,
        "Authentication failed",
        undefined,
        "Incorrect email"
      );
    }

    const passwordMatch = await bcrypt.compare(password, existingUser.password);

    if (!passwordMatch) {
      return this.sendResponse(
        res,
        400,
        "Authentication failed",
        undefined,
        "Incorrect password"
      );
    }

    const jwt = new JWT();
    const token = await jwt.createToken(existingUser);

    console.info("User logged in");
    return this.sendResponse(res, 200, "Login successful", {
      access_token: token,
      message:
        "Please copy this Access_Token and paste it in your http auth bearer token.",
    });
  };

  async delete(req, res) {
    const { id } = req.params;

    const existingUser = await this.model.findUnique({
      where: { id },
    });

    if (!existingUser) {
      return this.sendResponse(
        res,
        404,
        "User not found",
        undefined,
        "User does not exist"
      );
    }

    // Check if related records exist before attempting deletion
    const relatedEntities = await Promise.all([
      prisma.address.count({ where: { userId: id } }),
      prisma.album.count({ where: { userId: id } }),
      prisma.post.count({ where: { userId: id } }),
      prisma.todos.count({ where: { userId: id } }),
      prisma.album.findMany({
        where: { userId: id },
        select: { id: true },
      }),
    ]);

    const [addressCount, albumsCount, postsCount, todosCount, albums] =
      relatedEntities;
    const albumIds = albums.map((album) => album.id); // Extract just the album ids

    // Start a transaction for deleting the related records and the user
    await prisma.$transaction(async (tx) => {
      // Use prisma directly here, not this.prisma
      const deletePromises = [];

      // Delete images first (if any) - related to the albums
      if (albumIds.length > 0) {
        deletePromises.push(
          tx.image.deleteMany({
            where: {
              albumId: { in: albumIds },
            },
          })
        );
      }

      // Delete other related records
      if (addressCount > 0) {
        deletePromises.push(tx.address.deleteMany({ where: { userId: id } }));
      }
      if (albumsCount > 0) {
        deletePromises.push(tx.album.deleteMany({ where: { userId: id } }));
      }
      if (postsCount > 0) {
        deletePromises.push(tx.post.deleteMany({ where: { userId: id } }));
      }
      if (todosCount > 0) {
        deletePromises.push(tx.todos.deleteMany({ where: { userId: id } }));
      }

      // Execute the deletion of related records
      await Promise.all(deletePromises);

      // Finally, delete the user
      await tx.user.delete({ where: { id } });
    });

    await this.clearModelCache();
    console.info(`User with ID ${id} and related records deleted`);

    return this.sendResponse(res, 200, "User deleted successfully");
  }

  async update(req, res) {
    const { id } = req.params;
    const { email, password, role, name, username, phone, website } = req.body;

    let updateData = {};

    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;
    if (name !== undefined) updateData.name = name;
    if (username !== undefined) updateData.username = username;
    if (phone !== undefined) updateData.phone = phone;
    if (website !== undefined) updateData.website = website;

    const updatedUser = await this.model.update({
      where: { id },
      data: updateData,
    });

    await Promise.all([
      this.updateRecordCache(id, updatedUser),
      this.clearModelCache(),
    ]);

    return this.sendResponse(
      res,
      200,
      "User updated successfully",
      updatedUser
    );
  }
}
