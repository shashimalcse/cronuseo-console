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

        const resp = await fetch(routes.login, {
          credentials: "include",
          method: "POST",
          headers: { "Content-Type": "application/json ; charset=utf8" },
          body: JSON.stringify({username: username, password: password}),
        });

        if (resp.status === 200) {
          const json = await resp.json();
          return json.data;
        }
      },
    }),
  ],
  pages: {
    signIn : '/auth/signin'
  }
};

export default NextAuth(authOptions);
