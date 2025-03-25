// BaseOAuth.js
import passport from "passport";
import dotenv from "dotenv";
import { Request, Response, NextFunction, Application } from "express";
import JWT from "./Authentication";
import cookie_maker from "./Cookie_Maker";

dotenv.config();

export class BaseOAuth extends JWT {
  private readonly providerName: string;
  private readonly callback_url: string

  constructor(providerName: string, Strategy: any, config: any, scope: any) {
    super();
    this.providerName = providerName.toLowerCase();
    this.initStrategy(Strategy, config, scope);
    this.callback_url = process.env.JWT_SECRET!
  }

  private initStrategy(Strategy: any, config: any, scope: any) {
    passport.use(
      new Strategy(
        {
          clientID: config.clientID,
          clientSecret: config.clientSecret,
          callbackURL: config.callbackURL,
          scope: scope,
        },
        (
          accessToken: string,
          refreshToken: string,
          profile: object,
          done: Function
        ) => {
          // save profile to db in user schema.
          return done(null, profile);
        }
      )
    );
  }

  private authenticate = (scope?: any) => {
    return passport.authenticate(this.providerName, { scope });
  };

  private handleCallback = (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    passport.authenticate(
      this.providerName,
      { session: false },
      async (err: any, user: any) => {
        if (err || !user) {
          return res.status(400).json({ error: "Authentication failed" });
        }

        try {
          const token = await this.createToken({
            id: user.id,
            role: user.role,
          });
          // Set the token as an HTTP-only cookie
          cookie_maker(res, token)
          console.log({user: user, token: token})
          // res.json({ token });
          res.redirect(`${this.callback_url}/dashboard`);
        } catch (error) {
          res.status(500).json({ error: "Failed to generate token" });
        }
      }
    )(req, res, next);
  };

  private authSuccess = (req: Request, res: Response) => {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
    res.json({
      message: `${this.providerName} authentication successful`,
      token,
    });
  };

  private authLogout = (req: Request, res: Response) => {
    req.logout((err: any) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  };

  public setupRoutes(app: Application) {
    app.get(`/oauth/${this.providerName}`, this.authenticate());
    app.get(`/oauth/${this.providerName}/callback`, this.handleCallback);
    app.get("/oauth/success", this.authSuccess);
    app.get("/oauth/logout", this.authLogout);
  }
}
