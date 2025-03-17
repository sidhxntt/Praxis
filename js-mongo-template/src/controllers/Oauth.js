// BaseOAuth.js
import passport from "passport";
import dotenv from "dotenv";
import JWT from "./Authentication.js";

dotenv.config();

export class BaseOAuth extends JWT {
  constructor(providerName, Strategy, config, scope) {
    super();
    this.providerName = providerName.toLowerCase();
    this.initStrategy(Strategy, config, scope);
  }

  initStrategy(Strategy, config, scope) {
    passport.use(
      new Strategy(
        {
          clientID: config.clientID,
          clientSecret: config.clientSecret,
          callbackURL: config.callbackURL,
          scope: scope
        },
        (accessToken, refreshToken, profile, done) => {
          // save profile to db in user schema.
          return done(null, profile);
        }
      )
    );
  }

  authenticate = (scope) => {
    return passport.authenticate(this.providerName, { scope });
  };

  handleCallback = (req, res, next) => {
    passport.authenticate(this.providerName, { session: false }, async (err, user) => {
      if (err || !user) {
        return res.status(400).json({ error: "Authentication failed" });
      }

      try {
        console.log(user)
        const token = await this.createToken(user);
        res.json({ token });
      } catch (error) {
        res.status(500).json({ error: "Failed to generate token" });
      }
    })(req, res, next);
  };

  authSuccess = (req, res) => {
    const token = req.query.token;
    if (!token) {
      return res.status(400).json({ error: "No token provided" });
    }
    res.json({ 
      message: `${this.providerName} authentication successful`, 
      token 
    });
  };

  authLogout = (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Logout failed" });
      }
      res.json({ message: "Logged out successfully" });
    });
  };

  setupRoutes(app) {
    app.get(`/auth/${this.providerName}`, this.authenticate());
    app.get(`/auth/${this.providerName}/callback`, this.handleCallback);
    app.get("/auth/success", this.authSuccess);
    app.get("/auth/logout", this.authLogout);
  }
}
