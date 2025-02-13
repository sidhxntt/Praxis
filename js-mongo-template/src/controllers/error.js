import { Prisma } from "@prisma/client";
/**
 * Centralized error handling middleware.
 * Handles Prisma errors, validation errors, and general server errors.
 */
const error_handling = (err, req, res, next) => {
  console.error("Error:", err);

  // Default response structure
  let statusCode = 500;
  let errorMessage = "Internal Server Error";
  let errorDetails = undefined;

  // Handle Prisma Errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    statusCode = 400;
    errorMessage = "Database error";

    switch (err.code) {
      case "P2002":
        errorMessage = "Unique constraint failed. Duplicate entry detected.";
        break;
      case "P2003":
        errorMessage = "Foreign key constraint failed.";
        break;
      case "P2025":
        errorMessage = "Record not found.";
        statusCode = 404;
        break;
      default:
        errorDetails = err.message;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = 400;
    errorMessage = "Validation error. Invalid data format.";
  } else if (err instanceof Prisma.PrismaClientRustPanicError) {
    errorMessage = "Database runtime error.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    errorMessage = "Database connection error.";
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    errorMessage = "Unknown database request error.";
  }
  // Handle general errors
  else if (err instanceof SyntaxError) {
    statusCode = 400;
    errorMessage = "Invalid JSON payload.";
  } else if (err instanceof TypeError) {
    statusCode = 500;
    errorMessage = "Type error occurred.";
  } else {
    errorDetails = err.message;
  }

  // Send structured error response
  res.status(statusCode).json({
    status: "error",
    message: errorMessage,
    ...(errorDetails && { details: errorDetails }),
  });
};

export default error_handling;
