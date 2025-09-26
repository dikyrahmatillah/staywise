import nextAuth, { DefaultSession } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/axios";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

type DecodeToken = {
  id: string;
  name: string;
  email: string;
  image?: string;
  role: string;
  accessToken?: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
      image?: string;
      role: string;
      accessToken?: string;
    } & DefaultSession["user"];
  }
  interface User {
    accessToken?: string;
    role?: string;
  }
}

export const { handlers, signIn, signOut, auth } = nextAuth({
  providers: [
    GoogleProvider({
      id: "google",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GoogleProvider({
      id: "google-tenant",
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { type: "email", placeholder: "Email" },
        password: { type: "password", placeholder: "Password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        try {
          const response = await api.post("/auth/signin", credentials);
          const token = response?.data?.data?.accessToken;
          if (!token) return null;
          return {
            accessToken: token,
          };
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn() {
      return true;
    },
    async jwt({ token, user, account }) {
      if (account?.provider?.startsWith("google")) {
        try {
          const email = user.email;
          if (email) {
            const payload = {
              email,
              name: user.name,
              image: user.image,
              role: account.provider === "google-tenant" ? "TENANT" : "GUEST",
            };

            const resp = await api.post(`/auth/oauth`, payload);
            const dbData = resp.data.data;
            const dbUser = dbData.user;

            if (dbUser) {
              token.id = dbUser.id;
              token.name = dbUser.name;
              token.email = dbUser.email;
              token.image = dbUser.image;
              token.role = dbUser.role;
              token.accessToken = dbData.accessToken;
            }
          }
        } catch (error) {
          console.error("Error handling Google OAuth login:", error);
        }
      } else if (user?.accessToken) {
        token.accessToken = user.accessToken;
        try {
          const decoded = jwtDecode<DecodeToken>(user.accessToken);
          token.id = decoded.id;
          token.name = decoded.name;
          token.email = decoded.email;
          token.image = decoded.image;
          token.role = decoded.role;
        } catch (error) {
          console.error("Error decoding token:", error);
        }
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        const user = token as DecodeToken;
        session.user.id = user.id;
        session.user.name = user.name;
        session.user.email = user.email;
        session.user.image = user.image;
        session.user.role = user.role;
        session.user.accessToken = user.accessToken;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/signin",
    error: "/error",
  },
  debug: process.env.NODE_ENV === "development",
});
