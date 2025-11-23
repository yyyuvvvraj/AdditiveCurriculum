// src/app/api/auth/[...nextauth]/route.ts
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

// Helper to compute role from email without changing Prisma schema
function getRoleFromEmail(email?: string | null) {
  if (!email) return "operator";
  return email === "yuvraj280605@gmail.com" ? "admin" : "operator";
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),

  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),

    // Optional: email/password login using CredentialsProvider
    CredentialsProvider({
      name: "Email & Password",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const email = credentials?.email;
        const password = credentials?.password;

        if (!email || !password) return null;

        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user || !user.password) {
          return null;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) return null;

        // NextAuth only cares that we return an object with id/email/name
        return {
          id: user.id,
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],

  // Use JWT sessions (works well with App Router)
  session: {
    strategy: "jwt",
  },

  pages: {
    signIn: "/login",
  },

  callbacks: {
    async jwt({ token, user }) {
      // When user logs in, "user" is defined once
      if (user) {
        const email = user.email ?? token.email;
        const role = getRoleFromEmail(email as string | undefined);

        // Avoid TypeScript issues by using "any"
        (token as any).role = role;
      }
      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        // Attach id & role to session.user so your AuthContext/AdminGuard work
        (session.user as any).id = token.sub;
        (session.user as any).role =
          (token as any).role ?? getRoleFromEmail(session.user.email);
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
