export { default } from "next-auth/middleware"

export const config = { matcher: ["/resource", "/role", "/user", "/playground", "/settings"] }