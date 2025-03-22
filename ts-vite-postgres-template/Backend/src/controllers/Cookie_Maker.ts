import { Response } from "express";

function cookie_maker(res: Response, token: string){
    res.cookie("access_token", token, {
        // httpOnly: true, // Prevents access from JS (good for security)
        secure: false, // Set `true` in production (HTTPS only)
        sameSite: "lax", // Required for cross-origin cookies
        maxAge: 24 * 60 * 60 * 1000, // 1-day expiration
        path: "/",
      });
}

export default cookie_maker