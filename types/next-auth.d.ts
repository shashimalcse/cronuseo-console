import NextAuth from "next-auth";

declare module "next-auth" {
  interface User {
    org_id: string;
    user_id: string;
    username: string;
  }
  interface Session extends DefaultSession {
    user?: User;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    org_id: string;
    user_id: string;
    username: string;
  }
}
