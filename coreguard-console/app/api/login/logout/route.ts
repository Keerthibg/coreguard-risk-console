import { NextResponse } from "next/server"

export async function POST() {
  const res = NextResponse.json({ success: true })

  res.cookies.set("coreguard_token", "", {
    path: "/",
    expires: new Date(0),
  })

  return res
}