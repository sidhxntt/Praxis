// Usage: This file contains the class for API User. It contains methods for signup, login, and other user related operations.
// It extends the Data class and uses the PrismaClient instance for database operations.
// The class also contains methods for sending email and SMS notifications using Bull queues.

import bcrypt from "bcrypt";
import JWT from "../../controllers/Authentication.js";
import dotenv from "dotenv";
import { prisma } from "../Clients/Prisma.js";
import { BaseData } from "./BaseData.js";
import cookie_maker from "../../controllers/Cookie_Maker.js";
import { emailQueue, smsQueue } from "../Clients/Queues.js";

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
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      username,
    } = req.body;

    // Missing password parameter in destructuring
    if (!password || !email) {
      return this.sendResponse(
        res,
        400,
        "Email & Password are required.",
        undefined,
        "Missing password and email."
      );
    }

    // Data object was declared but not properly populated
    const user = {
      email,
      password: await bcrypt.hash(password, 10),
      role,
      first_name: firstName,
      last_name: lastName,
      username,
      phone: phoneNumber,
    };

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

    // Using the data object instead of individual parameters
    const newUser = await this.model.create({
      data: {
        email: user.email,
        password: user.password,
        first_name: user.first_name,
        last_name: user.last_name,
        username: user.username,
        role: user.role,
        phone: user.phone,
      },
    });

    console.info("New user created");
    await this.clearModelCache();
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

    // Set the token as an HTTP-only cookie
    cookie_maker(res, token);

    console.info("User logged in");
    return this.sendResponse(res, 200, "Login successful", {
      message: "You are now logged in. Authentication cookie has been set.",
      token: token,
    });
  };

  async delete(req, res) {
    const { id } = req.params;
    const userId = this.parseIdToNumber(id);

    const existingUser = await this.model.findUnique({
      where: { id: userId },
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

    // Perform cascading delete
    await prisma.$transaction([
      // Delete related profile if exists
      prisma.profile.deleteMany({
        where: { userId },
      }),
      // Delete related account if exists
      prisma.account.deleteMany({
        where: { userId },
      }),
      // Finally delete the user
      prisma.user.delete({
        where: { id: userId },
      }),
    ]);

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
      firstName,
      lastName,
      phoneNumber,
      username,
    } = req.body;
    const userId = this.parseIdToNumber(id);

    let updateData = {};

    if (email) {
      if (!this.isValidEmail(email)) {
        return this.sendResponse(
          res,
          400,
          "Invalid email format",
          undefined,
          "Validation error"
        );
      }
      updateData.email = email;
    }

    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;
    if (firstName !== undefined) updateData.first_name = firstName;
    if (lastName !== undefined) updateData.last_name = lastName;
    if (username !== undefined) updateData.username = username;
    if (phoneNumber !== undefined) updateData.phone = phoneNumber;

    const updatedUser = await this.model.update({
      where: { id: userId },
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

  invite = async (req, res) => {
    const { email, role, description } = req.body;

    // Missing password parameter in destructuring
    if (!email) {
      return this.sendResponse(
        res,
        400,
        "Email is required.",
        undefined,
        "Missing Email."
      );
    }

    const emailJob = await emailQueue.add("send-email", {
      email: process.env.SMTP_FROM,
      message: email,
      role,
      description,
    });
    console.info(`Added job to email queue. Email Job ID: ${emailJob.id}`);

    // const smsJob = await smsQueue.add("send-sms", {
    //   to: process.env.PHONE_NUMBER,
    //   message: email, role, description,
    // });
    // console.info(`Added job to email queue. SMS Job ID: ${smsJob.id}`);
    return this.sendResponse(res, 201, "Invite Email send successfully", null);
  };
}
