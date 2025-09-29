import { NextAuthOptions } from "next-auth"
import TwitterProvider from "next-auth/providers/twitter"

export const authOptions: NextAuthOptions = {
  providers: [
    TwitterProvider({
      clientId: process.env.TWITTER_CLIENT_ID!,
      clientSecret: process.env.TWITTER_CLIENT_SECRET!,
    })
  ],
  callbacks: {
    async session({ session, token }) {
      return session
    },
    async jwt({ token, account, profile }) {
      return token
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}
