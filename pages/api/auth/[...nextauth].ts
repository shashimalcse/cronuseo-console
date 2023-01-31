import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { routes } from "../../../src/routes";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      type: "credentials",
      credentials: {},
      async authorize(credentials, req) {
        const { username, password } = credentials as {
          username: string;
          password: string;
        };
        const resp = await fetch(`${process.env.BASE_API}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json ; charset=utf8" },
          body: JSON.stringify({ username: username, password: password }),
        });
        if (resp.status === 200) {
          const data = await resp.json();
          const token = data.token;
          const resp2 = await fetch(`${process.env.BASE_API}/auth/me`, {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json ; charset=utf8",
            },
          });

          if (resp2.status === 200) {
            const userData = await resp2.json();
            const user = { ...userData, token };
            return user;
          } else {
            throw new Error("Invalid");
          }
        } else {
          throw new Error("Invalid");
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.token;
        token.user_id = user.user_id;
        token.org_id = user.org_id;
        token.username = user.username;
      }
      return token;
    },
    session({ session, token }) {
      if (token && session.user) {
        session.user.user_id = token.user_id;
        session.user.org_id = token.org_id;
        session.user.username = token.username;
        session.accessToken = token.accessToken;
      }
      return session;
    },
  },
};

export default NextAuth(authOptions);
