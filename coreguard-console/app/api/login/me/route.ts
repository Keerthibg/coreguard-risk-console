import { NextResponse } from "next/server"
import { jwtVerify } from "jose"

const SECRET = new TextEncoder().encode("coreguard_secret_key")

export async function GET(req: Request) {
  try {
    const cookie = req.headers.get("cookie") || ""

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("coreguard_token="))
      ?.split("=")[1]

    if (!token) {
      return NextResponse.json({ role: "user" })
    }

    const { payload } = await jwtVerify(token, SECRET)

    return NextResponse.json({
      role: payload.role || "user",
    })
  } catch (err) {
    // VERY IMPORTANT: never break frontend
    return NextResponse.json({ role: "user" })
  }
}