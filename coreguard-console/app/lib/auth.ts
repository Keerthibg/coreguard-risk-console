import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode("coreguard_secret_key")

export async function getRoleFromCookie() {
  try {
    const cookie = document.cookie
      .split("; ")
      .find((row) => row.startsWith("coreguard_token="))
      ?.split("=")[1]

    if (!cookie) return null

    const { payload } = await jwtVerify(cookie, SECRET)

    return payload.role as string
  } catch (err) {
    return null
  }
}