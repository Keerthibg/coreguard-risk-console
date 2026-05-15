import { NextResponse } from "next/server"

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json()

    // SIMPLE ROLE CHECK (safe mode)
    let role: "admin" | "user" | null = null

    if (username === "admin" && password === "1234") {
      role = "admin"
    }

    if (username === "user" && password === "1234") {
      role = "user"
    }

    // INVALID LOGIN
    if (!role) {
      return NextResponse.json(
        { success: false, message: "Invalid credentials" },
        { status: 401 }
      )
    }

    // CREATE RESPONSE
    const res = NextResponse.json({
      success: true,
      role,
    })

    // SAFE COOKIE (NOT JWT YET)
    res.cookies.set("coreguard_token", role, {
      path: "/",
      httpOnly: false, // safe mode (frontend still reads it)
      sameSite: "lax",
    })

    return res
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Server error" },
      { status: 500 }
    )
  }
}