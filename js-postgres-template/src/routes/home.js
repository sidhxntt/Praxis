// Desc: Home route to show the welcome message to the user
import express from "express";
const router = express.Router();

router.get("/", async (req, res, next) => {
  try {
    res
      .status(200)
      .json({
        message:
          "Welcome to JOLT 🚀, to access this API please signup & then login.",
        for_signup:
          "Please go to the path /api/signup and register yourself to access the API",
        for_login:
          "Please go to the path /api/login and login yourself to continue",
      });
  } catch (error) {
    next(error);
  }
});

export default router;
