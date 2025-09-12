import nextAuth, { DefaultSession } from "next-auth";
import { jwtDecode } from "jwt-decode";
import { api } from "@/lib/axios";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";

type DecodeToken = {
  id: string;
  name: string;
  email: string;
  role: string;
  accessToken?: string;
};

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name: string;
      email: string;
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
  // Comment out PrismaAdapter since we're using JWT sessions
  // adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
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
      if (account?.provider === "google") {
        try {
          const resp = await api.get(`/auth/user`, {
            params: { email: token.email },
          });
          const dbUser = resp?.data?.data;
          if (dbUser) {
            token.id = dbUser.id;
            token.name = dbUser.name;
            token.email = dbUser.email;
            token.role = dbUser.role;
          }
        } catch (error) {
          console.error("Error fetching user from API:", error);
        }
      } else if (user?.accessToken) {
        token.accessToken = user.accessToken;
        try {
          const decoded = jwtDecode<DecodeToken>(user.accessToken);
          token.id = decoded.id;
          token.name = decoded.name;
          token.email = decoded.email;
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
