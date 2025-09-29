import { ExpressAuth } from "@auth/express";
import Twitter from "@auth/express/providers/twitter";

export const authConfig = {
  providers: [
    Twitter({
      clientId: process.env.AUTH_TWITTER_ID!,
      clientSecret: process.env.AUTH_TWITTER_SECRET!,
    })
  ],
  secret: process.env.AUTH_SECRET!,
  trustHost: true,
};
