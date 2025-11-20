// src/app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { NextAuthOptions } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "258196648718-405g8f86mh65lssl19f5m2noqtt8o58p.apps.googleusercontent.com",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "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",
    }),
    // Optional demo credentials provider (useful for local dev)
    CredentialsProvider({
      name: "Demo",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // demo: accept any email/password — replace with real validation later
        if (!credentials?.email) return null;
        return { id: "demo:" + credentials.email, name: credentials.email.split("@")[0], email: credentials.email };
      },
    }),
  ],

  session: {
    strategy: "jwt",
    maxAge: 60 * 60 * 24 * 7, // 7 days
  },

  callbacks: {
    async jwt({ token, user, account }) {
      // first sign in
      if (user) {
        token.user = user;
      }
      return token;
    },
    async session({ session, token }) {
      // attach token.user to session.user so useAuth can read fields
      (session as any).user = (token as any).user ?? session.user;
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };