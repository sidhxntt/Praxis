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

export default class User extends BaseData {
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

    if (!email || !password) {
      return this.sendResponse(
        res,
        400,
        "Email and password are required",
        undefined,
        "Missing required fields"
      );
    }

    const validEmail = this.isValidEmail(email);
    if (!validEmail) {
      return this.sendResponse(
        res,
        400,
        "Invalid email format",
        undefined,
        "Invalid email"
      );
    }

    const existingUser = await this.model.findUnique({
      where: { email },
    });

    if (existingUser) {
      return this.sendResponse(
        res,
        400,
        "Email already exists",
        undefined,
        "Duplicate email"
      );
    }

    // Check if username exists if provided
    if (username) {
      const existingUsername = await this.model.findUnique({
        where: { username },
      });
      if (existingUsername) {
        return this.sendResponse(
          res,
          400,
          "Username already exists",
          undefined,
          "Duplicate username"
        );
      }
    }

    // Check if phone exists if provided
    if (phone) {
      const existingPhone = await this.model.findUnique({
        where: { phone },
      });
      if (existingPhone) {
        return this.sendResponse(
          res,
          400,
          "Phone number already exists",
          undefined,
          "Duplicate phone"
        );
      }
    }

    // Check if website exists if provided
    if (website) {
      const existingWebsite = await this.model.findUnique({
        where: { website },
      });
      if (existingWebsite) {
        return this.sendResponse(
          res,
          400,
          "Website already exists",
          undefined,
          "Duplicate website"
        );
      }
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await this.model.create({
      data: {
        email,
        password: hashedPassword,
        role,
        name,
        username,
        phone,
        website,
      },
    });

    const emailJob = await emailQueue.add("send-email", {
      email: process.env.SMTP_FROM,
      message: "New User added to API",
    });
    console.info(`Added job to email queue. Email Job ID: ${emailJob.id}`);

    const smsJob = await smsQueue.add("send-sms", {
      to: process.env.PHONE_NUMBER,
      message: "New User added to API",
    });
    console.info(`Added job to email queue. SMS Job ID: ${smsJob.id}`);

    console.info("New user created");
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
    const token = await jwt.createToken({
      id: existingUser.id,
      role: existingUser.role,
    });

    console.info("User logged in");
    return this.sendResponse(res, 200, "Login successful", {
      access_token: token,
      message:
        "Please copy this Access_Token and paste it in your http auth bearer token.",
    });
  };

  async delete(req, res) {
    const { id } = req.params;
  
    const existingUser = await this.model.findUnique({ where: { id } });
  
    if (!existingUser) {
      return this.sendResponse(res, 404, "User not found", undefined, "User does not exist");
    }
  
    // Fetch related data in a single query
    const relatedData = await prisma.$transaction(async (tx) => {
      const addressCount = await tx.address.count({ where: { userId: id } });
      const albums = await tx.album.findMany({ where: { userId: id }, select: { id: true } });
      const postsCount = await tx.post.count({ where: { userId: id } });
      const todosCount = await tx.todos.count({ where: { userId: id } });
  
      return { addressCount, albums, postsCount, todosCount };
    });
  
    const albumIds = relatedData.albums.map((album) => album.id);
  
    // Execute transaction for deletion
    await prisma.$transaction(async (tx) => {
      if (albumIds.length) {
        await tx.image.deleteMany({ where: { albumId: { in: albumIds } } });
      }
      if (relatedData.addressCount) {
        await tx.address.deleteMany({ where: { userId: id } });
      }
      if (relatedData.albums.length) {
        await tx.album.deleteMany({ where: { userId: id } });
      }
      if (relatedData.postsCount) {
        await tx.post.deleteMany({ where: { userId: id } });
      }
      if (relatedData.todosCount) {
        await tx.todos.deleteMany({ where: { userId: id } });
      }
  
      await tx.user.delete({ where: { id } });
    });
  
    await this.clearModelCache();
    console.info(`User with ID ${id} and related records deleted`);
  
    return this.sendResponse(res, 200, "User deleted successfully");
  }

  async update(req, res) {
    const { id } = req.params;
    const {
      email,
      password,
      role,
      first_name,
      last_name,
      full_name,
      username,
      phone,
      website,
    } = req.body;

    let updateData = {};

    if (email) updateData.email = email;
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;
    if (first_name !== undefined) updateData.first_name = first_name;
    if (last_name !== undefined) updateData.last_name = last_name;
    if (full_name !== undefined) updateData.full_name = full_name;
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
