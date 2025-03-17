// GoogleAuth.js
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import { BaseOAuth } from "./Oauth.js";

export class GoogleAuth extends BaseOAuth {
  constructor() {
    const config = {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    };
    const scope = ["profile", "email"];
    
    super("google", GoogleStrategy, config, scope);
  }
}


export class GitHubAuth extends BaseOAuth {
  constructor() {
    const config = {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
    };
    const scope = ["user:email"];
    
    super("github", GitHubStrategy, config, scope);
  }
}

// routes.js
export function setupOAuthRoutes(app) {
  const googleAuth = new GoogleAuth();
  const githubAuth = new GitHubAuth();

  googleAuth.setupRoutes(app);
  githubAuth.setupRoutes(app);
}